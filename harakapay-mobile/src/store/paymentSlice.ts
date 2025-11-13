// Payment slice for Redux
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../config/supabase';
import { WEB_API_URL } from '../config/env';
import type { Session } from '@supabase/supabase-js';
import { isSessionValid } from '../utils/tokenValidation';

export interface FeeCategoryItem {
  id: string;
  name: string;
  amount: number;
  is_mandatory: boolean;
  supports_recurring: boolean;
  supports_one_time: boolean;
}

export interface PaymentPlan {
  id: string;
  type: 'monthly' | 'per-term' | 'upfront' | 'custom';
  discount_percentage: number;
  currency: string;
  installments: Array<{
    installment_number: number;
    label: string;
    amount: number;
    due_date: string;
  }>;
  is_active: boolean;
  created_at: string;
}

export interface StudentFeeData {
  studentId: string;
  categories: FeeCategoryItem[];
  paymentPlans: PaymentPlan[];
  feeStructure: any;
  lastUpdated: number;
}

interface PaymentState {
  studentFees: Record<string, StudentFeeData>;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  studentFees: {},
  loading: false,
  error: null,
};

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

// Async thunk to fetch student fee data
export const fetchStudentFeeData = createAsyncThunk(
  'payment/fetchStudentFeeData',
  async ({ studentId, session }: { studentId: string; session?: Session | null }, { rejectWithValue, getState }) => {
    try {
      // Check cache first
      const state = getState() as any;
      const cachedData = state.payment.studentFees[studentId];
      const now = Date.now();
      
      if (cachedData && (now - cachedData.lastUpdated) < CACHE_DURATION) {
        console.log('🔄 Using cached fee data for student:', studentId);
        return cachedData;
      }

      console.log('🔍 Fetching fresh fee data for student:', studentId);

      // Get session from Redux or parameter
      let authSession = session;
      if (!authSession) {
        const authState = state.auth;
        authSession = authState.session;
      }

      if (!authSession?.access_token) {
        throw new Error('No authentication token available');
      }

      // Validate session is not expired
      if (!isSessionValid(authSession)) {
        console.warn('⚠️ fetchStudentFeeData: Session expired, attempting refresh...');

        try {
          const { data, error } = await supabase.auth.refreshSession();

          if (error || !data.session) {
            console.error('❌ fetchStudentFeeData: Session refresh failed:', error);
            throw new Error('Session expired. Please log in again.');
          }

          console.log('✅ fetchStudentFeeData: Session refreshed successfully');
          authSession = data.session;
        } catch (refreshError) {
          console.error('💥 fetchStudentFeeData: Refresh exception:', refreshError);
          throw new Error('Session expired. Please log in again.');
        }
      }

      // Fetch student fee details
      const response = await fetch(`${WEB_API_URL}/api/parent/student-fees-detailed`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authSession.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch student fee details: ${response.status}`);
      }

      const data = await response.json();
      
      // Find the specific student's data
      const studentData = data.student_fees?.find((s: any) => s?.student?.id === studentId);
      
      // If no student data found, return empty data structure instead of throwing error
      if (!studentData) {
        console.log('ℹ️ No fee data found for student:', studentId, '- returning empty data');
        const emptyResult: StudentFeeData = {
          studentId,
          categories: [],
          paymentPlans: [],
          feeStructure: null,
          lastUpdated: now,
        };
        return emptyResult;
      }

      // Transform the data
      const categories: FeeCategoryItem[] = studentData.fee_categories || [];
      const paymentPlans: PaymentPlan[] = studentData.payment_schedules?.map((schedule: any) => ({
        id: schedule.id,
        type: schedule.schedule_type,
        discount_percentage: schedule.discount_percentage || 0,
        currency: 'USD',
        installments: schedule.installments || [],
        is_active: true,
        created_at: new Date().toISOString()
      })) || [];

      const result: StudentFeeData = {
        studentId,
        categories,
        paymentPlans,
        feeStructure: studentData.fee_template,
        lastUpdated: now,
      };

      console.log('✅ Successfully fetched fee data for student:', studentId);
      return result;
    } catch (error) {
      console.error('💥 Error fetching student fee data:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch fee data');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    invalidateStudentCache: (state, action: PayloadAction<string>) => {
      // Remove specific student's cache
      delete state.studentFees[action.payload];
    },
    invalidateAllCache: (state) => {
      // Clear all cached data (useful after payments)
      state.studentFees = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentFeeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentFeeData.fulfilled, (state, action) => {
        state.loading = false;
        state.studentFees[action.payload.studentId] = action.payload;
        state.error = null;
      })
      .addCase(fetchStudentFeeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, invalidateStudentCache, invalidateAllCache } = paymentSlice.actions;
export default paymentSlice.reducer;
