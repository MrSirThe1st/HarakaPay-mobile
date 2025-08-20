import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  role: 'parent' | 'school_staff' | 'admin';
  school_id?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

export interface AuthResponse {
  success: boolean;
  error: string | null;
  user?: User | null;
}

const STORAGE_KEYS = {
  SESSION: '@harakapay_session',
  USER: '@harakapay_user',
  PROFILE: '@harakapay_profile',
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    error: null,
    initialized: false,
  });

  // Load stored auth data
  const loadStoredAuth = useCallback(async () => {
    try {
      const [storedSession, storedUser, storedProfile] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.SESSION),
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.PROFILE),
      ]);

      if (storedSession && storedUser) {
        const session = JSON.parse(storedSession);
        const user = JSON.parse(storedUser);
        const profile = storedProfile ? JSON.parse(storedProfile) : null;

        // Check if session is still valid
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          setAuthState({
            user,
            profile,
            session: currentSession,
            loading: false,
            error: null,
            initialized: true,
          });
        } else {
          // Session expired, clear storage
          await clearStoredAuth();
          setAuthState(prev => ({
            ...prev,
            loading: false,
            initialized: true,
          }));
        }
      } else {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          initialized: true,
        }));
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load stored authentication',
        initialized: true,
      }));
    }
  }, []);

  // Clear stored auth data
  const clearStoredAuth = useCallback(async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.SESSION),
        AsyncStorage.removeItem(STORAGE_KEYS.USER),
        AsyncStorage.removeItem(STORAGE_KEYS.PROFILE),
      ]);
    } catch (error) {
      console.error('Error clearing stored auth:', error);
    }
  }, []);

  // Store auth data
  const storeAuthData = useCallback(async (session: Session, user: User, profile?: Profile) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session)),
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
        profile && AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile)),
      ]);
    } catch (error) {
      console.error('Error storing auth data:', error);
    }
  }, []);

  // Fetch user profile
  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }, []);

  // Update auth state
  const updateAuthState = useCallback(async (session: Session | null) => {
    if (session?.user) {
      const profile = await fetchProfile(session.user.id);
      
      setAuthState({
        user: session.user,
        profile,
        session,
        loading: false,
        error: null,
        initialized: true,
      });

      await storeAuthData(session, session.user, profile || undefined);
    } else {
      setAuthState({
        user: null,
        profile: null,
        session: null,
        loading: false,
        error: null,
        initialized: true,
      });

      await clearStoredAuth();
    }
  }, [fetchProfile, storeAuthData, clearStoredAuth]);

  // Initialize auth
  useEffect(() => {
    loadStoredAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_OUT') {
          await clearStoredAuth();
        }
        
        await updateAuthState(session);
      }
    );

    return () => subscription.unsubscribe();
  }, [loadStoredAuth, updateAuthState, clearStoredAuth]);

  // Sign in
  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
        return { success: false, error: error.message };
      }

      if (data.session && data.user) {
        await updateAuthState(data.session);
        return { success: true, error: null, user: data.user };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

  // Sign up
  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone?: string
  ): Promise<AuthResponse> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            role: 'parent', // Mobile app is for parents only
            phone: phone?.trim(),
          },
        },
      });

      if (error) {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
        return { success: false, error: error.message };
      }

      // For email confirmation, user won't be signed in immediately
      if (data.user && !data.session) {
        setAuthState(prev => ({ ...prev, loading: false }));
        return {
          success: true,
          error: null,
          user: data.user,
        };
      }

      // If auto-confirm is enabled, handle sign in
      if (data.session && data.user) {
        await updateAuthState(data.session);
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }

      return { success: true, error: null, user: data.user };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

  // Reset password
  const resetPassword = async (email: string): Promise<AuthResponse> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.toLowerCase().trim(),
        {
          redirectTo: 'harakapay://reset-password', // Deep link for mobile
        }
      );

      setAuthState(prev => ({ ...prev, loading: false }));

      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message }));
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

  // Sign out
  const signOut = async (): Promise<AuthResponse> => {
    setAuthState(prev => ({ ...prev, loading: true }));

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
        return { success: false, error: error.message };
      }

      await clearStoredAuth();
      setAuthState({
        user: null,
        profile: null,
        session: null,
        loading: false,
        error: null,
        initialized: true,
      });

      return { success: true, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

  // Refresh profile
  const refreshProfile = async (): Promise<void> => {
    if (authState.user) {
      const profile = await fetchProfile(authState.user.id);
      setAuthState(prev => ({
        ...prev,
        profile,
      }));

      if (profile) {
        await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      }
    }
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword,
    refreshProfile,
  };
};