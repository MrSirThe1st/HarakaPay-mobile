// Custom hook for payment data with smart caching
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { 
  fetchStudentFeeData, 
  clearError, 
  invalidateStudentCache,
  type StudentFeeData 
} from '../store/paymentSlice';

export const usePaymentData = (studentId: string) => {
  const dispatch = useDispatch<AppDispatch>();
  
  const paymentState = useSelector((state: RootState) => state.payment);
  const authSession = useSelector((state: RootState) => state.auth.session);
  
  const studentData = paymentState.studentFees[studentId];
  const isLoading = paymentState.loading;
  const error = paymentState.error;

  // Check if we have cached data that's still valid
  const hasCachedData = !!studentData;
  const cacheAge = studentData ? Date.now() - studentData.lastUpdated : Infinity;
  const isCacheValid = cacheAge < 5 * 60 * 1000; // 5 minutes

  // Load data function
  const loadData = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && hasCachedData && isCacheValid) {
      console.log('📚 Using cached payment data for student:', studentId);
      return;
    }

    console.log('🔄 Loading payment data for student:', studentId);
    try {
      await dispatch(fetchStudentFeeData({ studentId, session: authSession })).unwrap();
    } catch (error) {
      console.error('❌ Failed to load payment data:', error);
    }
  }, [dispatch, studentId, authSession, hasCachedData, isCacheValid]);

  // Auto-load data on mount if not cached or cache is stale
  useEffect(() => {
    if (!hasCachedData || !isCacheValid) {
      loadData();
    }
  }, [studentId, hasCachedData, isCacheValid, loadData]);

  // Refresh function for manual refresh (pull-to-refresh, etc.)
  const refreshData = useCallback(() => {
    return loadData(true);
  }, [loadData]);

  // Clear error function
  const clearErrorState = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Invalidate cache for this student (useful after payments)
  const invalidateCache = useCallback(() => {
    dispatch(invalidateStudentCache(studentId));
  }, [dispatch, studentId]);

  return {
    // Data
    categories: studentData?.categories || [],
    paymentPlans: studentData?.paymentPlans || [],
    feeStructure: studentData?.feeStructure || null,
    
    // State
    isLoading,
    error,
    hasCachedData,
    isCacheValid,
    lastUpdated: studentData?.lastUpdated,
    
    // Actions
    loadData,
    refreshData,
    clearError: clearErrorState,
    invalidateCache,
  };
};

export default usePaymentData;