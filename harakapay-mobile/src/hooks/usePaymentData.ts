// Custom hook for payment data with React Query
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { WEB_API_URL } from '../config/env';
import { supabase } from '../config/supabase';

export interface FeeCategoryItem {
  id: string;
  name: string;
  amount: number;
  remaining_balance?: number;
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

const fetchStudentFeeData = async (studentId: string, accessToken: string): Promise<StudentFeeData> => {
  console.log('🔍 Fetching fresh fee data for student:', studentId);

  // Get fresh session (with automatic refresh if needed)
  let token = accessToken;

  if (!token) {
    console.log('No token provided, getting session...');
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session?.access_token) {
      console.log('No valid session, attempting to refresh...');
      const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();

      if (refreshError || !refreshedSession?.access_token) {
        console.error('Failed to refresh session:', refreshError);
        throw new Error('No authentication token available - please log in again');
      }

      token = refreshedSession.access_token;
    } else {
      token = session.access_token;
    }
  }

  let response = await fetch(`${WEB_API_URL}/api/parent/student-fees-detailed`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  // If 401, try refreshing session and retry once
  if (response.status === 401) {
    console.log('Got 401, refreshing session and retrying...');
    const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();

    if (refreshError || !refreshedSession?.access_token) {
      console.error('Failed to refresh session:', refreshError);
      throw new Error('Session expired - please log in again');
    }

    token = refreshedSession.access_token;

    // Retry the request with new token
    response = await fetch(`${WEB_API_URL}/api/parent/student-fees-detailed`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch student fee details: ${response.status}`);
  }

  const data = await response.json();

  // Find the specific student's data
  const studentData = data.student_fees?.find((s: any) => s?.student?.id === studentId);

  // If no student data found, return empty data structure
  if (!studentData) {
    console.log('ℹ️ No fee data found for student:', studentId, '- returning empty data');
    return {
      studentId,
      categories: [],
      paymentPlans: [],
      feeStructure: null,
      lastUpdated: Date.now(),
    };
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
    created_at: new Date().toISOString(),
  })) || [];

  return {
    studentId,
    categories,
    paymentPlans,
    feeStructure: studentData.fee_template || null,
    lastUpdated: Date.now(),
  };
};

export const usePaymentData = (studentId: string) => {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    refetch,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ['studentFeeData', studentId],
    queryFn: () => fetchStudentFeeData(studentId, session?.access_token || ''),
    enabled: !!session?.access_token && !!studentId,
    staleTime: 5 * 60 * 1000, // 5 minutes - data considered fresh for 5 min
    gcTime: 10 * 60 * 1000, // 10 minutes - cache kept for 10 min
  });

  const hasCachedData = !!data;
  const cacheAge = dataUpdatedAt ? Date.now() - dataUpdatedAt : Infinity;
  const isCacheValid = cacheAge < 5 * 60 * 1000; // 5 minutes

  // Invalidate cache for this student (useful after payments)
  const invalidateCache = () => {
    queryClient.invalidateQueries({ queryKey: ['studentFeeData', studentId] });
  };

  // Refresh data (force refetch)
  const refreshData = async () => {
    await refetch();
  };

  return {
    // Data
    categories: data?.categories || [],
    paymentPlans: data?.paymentPlans || [],
    feeStructure: data?.feeStructure || null,

    // State
    isLoading,
    error: error ? (error as Error).message : null,
    hasCachedData,
    isCacheValid,
    lastUpdated: data?.lastUpdated,

    // Actions
    loadData: refreshData, // Alias for compatibility
    refreshData,
    clearError: () => {
      // React Query handles errors differently, but for compatibility
      queryClient.setQueryData(['studentFeeData', studentId], (old: any) => old);
    },
    invalidateCache,
  };
};

export default usePaymentData;
