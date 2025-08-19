import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadUserSession } from '../store/authSlice';
import type { AppDispatch, RootState } from '../store';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(loadUserSession() as any);
  }, [dispatch]);

  return auth;
};
