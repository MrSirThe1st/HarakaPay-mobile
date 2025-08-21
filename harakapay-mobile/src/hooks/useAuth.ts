// Updated harakapay-mobile/src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabase';
import type { User, Session } from '@supabase/supabase-js';

// Updated to use Parent type instead of Profile
export interface Parent {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  national_id: string | null;
  avatar_url: string | null;
  notification_preferences: any;
  payment_preferences: any;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  parent: Parent | null; // Changed from 'profile' to 'parent'
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
  PARENT: '@harakapay_parent', // Changed from PROFILE to PARENT
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    parent: null, // Changed from profile to parent
    session: null,
    loading: true,
    error: null,
    initialized: false,
  });

  // Clear stored auth data
  const clearStoredAuth = useCallback(async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.SESSION),
        AsyncStorage.removeItem(STORAGE_KEYS.USER),
        AsyncStorage.removeItem(STORAGE_KEYS.PARENT), // Changed from PROFILE
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }, []);

  // Load stored auth data
  const loadStoredAuth = useCallback(async () => {
    try {
      const [sessionData, userData, parentData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.SESSION),
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.PARENT), // Changed from PROFILE
      ]);

      if (sessionData && userData) {
        const session = JSON.parse(sessionData);
        const user = JSON.parse(userData);
        const parent = parentData ? JSON.parse(parentData) : null;

        // Verify session is still valid
        const { data: currentSession } = await supabase.auth.getSession();
        
        if (currentSession.session) {
          setAuthState({
            user,
            parent, // Changed from profile
            session,
            loading: false,
            error: null,
            initialized: true,
          });
        } else {
          await clearStoredAuth();
          setAuthState({
            user: null,
            parent: null, // Changed from profile
            session: null,
            loading: false,
            error: null,
            initialized: true,
          });
        }
      } else {
        setAuthState({
          user: null,
          parent: null, // Changed from profile
          session: null,
          loading: false,
          error: null,
          initialized: true,
        });
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      setAuthState({
        user: null,
        parent: null, // Changed from profile
        session: null,
        loading: false,
        error: 'Failed to load stored authentication',
        initialized: true,
      });
    }
  }, [clearStoredAuth]);

  // Store auth data
  const storeAuthData = useCallback(async (session: Session, user: User, parent?: Parent) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session)),
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
        parent && AsyncStorage.setItem(STORAGE_KEYS.PARENT, JSON.stringify(parent)), // Changed from PROFILE
      ]);
    } catch (error) {
      console.error('Error storing auth data:', error);
    }
  }, []);

  // Fetch parent data (changed from fetchProfile)
  const fetchParent = useCallback(async (userId: string): Promise<Parent | null> => {
    try {
      // Fetch from parents table instead of profiles table
      const { data, error } = await supabase
        .from('parents') // Changed from 'profiles' to 'parents'
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching parent:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching parent:', error);
      return null;
    }
  }, []);

  // Update auth state
  const updateAuthState = useCallback(async (session: Session | null) => {
    if (session?.user) {
      const parent = await fetchParent(session.user.id); // Changed from fetchProfile
      
      setAuthState({
        user: session.user,
        parent, // Changed from profile
        session,
        loading: false,
        error: null,
        initialized: true,
      });

      await storeAuthData(session, session.user, parent || undefined);
    } else {
      setAuthState({
        user: null,
        parent: null, // Changed from profile
        session: null,
        loading: false,
        error: null,
        initialized: true,
      });

      await clearStoredAuth();
    }
  }, [fetchParent, storeAuthData, clearStoredAuth]); // Changed from fetchProfile

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

  // Sign up (keeping the existing logic)
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
        parent: null, // Changed from profile
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

  // Refresh parent data
  const refreshParent = async (): Promise<void> => {
    if (authState.user) {
      const parent = await fetchParent(authState.user.id);
      setAuthState(prev => ({
        ...prev,
        parent,
      }));

      if (parent) {
        await AsyncStorage.setItem(STORAGE_KEYS.PARENT, JSON.stringify(parent));
      }
    }
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword,
    refreshParent, // Changed from refreshProfile
  };
};