// harakapay-mobile/src/hooks/useAuth.ts - Fixed Session Persistence
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabase';
import type { User, Session } from '@supabase/supabase-js';

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
  parent: Parent | null;
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
  PARENT: '@harakapay_parent',
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    parent: null,
    session: null,
    loading: true,
    error: null,
    initialized: false,
  });

  const clearStoredAuth = useCallback(async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.SESSION),
        AsyncStorage.removeItem(STORAGE_KEYS.USER),
        AsyncStorage.removeItem(STORAGE_KEYS.PARENT),
      ]);
      console.log('✅ Cleared stored auth data');
    } catch (error) {
      console.error('❌ Error clearing auth data:', error);
    }
  }, []);

  const storeAuthData = useCallback(async (session: Session, user: User, parent?: Parent) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session)),
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
        parent && AsyncStorage.setItem(STORAGE_KEYS.PARENT, JSON.stringify(parent)),
      ]);
      console.log('✅ Stored auth data successfully');
    } catch (error) {
      console.error('❌ Error storing auth data:', error);
    }
  }, []);

  const fetchParent = useCallback(async (userId: string): Promise<Parent | null> => {
    try {
      console.log('🔍 Fetching parent for user:', userId);
      
      const { data, error } = await supabase
        .from('parents')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('❌ Error fetching parent:', error);
        return null;
      }

      if (data) {
        console.log('✅ Parent record found:', data);
        return data;
      } else {
        console.log('ℹ️ No parent record found for user:', userId);
        return null;
      }
      
    } catch (error) {
      console.error('💥 Exception while fetching parent:', error);
      return null;
    }
  }, []);

  // Fixed session refresh logic
  const refreshSession = useCallback(async (): Promise<Session | null> => {
    try {
      console.log('🔄 Attempting to refresh session...');
      
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.log('❌ Session refresh failed:', error.message);
        return null;
      }
      
      if (data.session) {
        console.log('✅ Session refreshed successfully');
        return data.session;
      }
      
      return null;
    } catch (error) {
      console.error('💥 Session refresh exception:', error);
      return null;
    }
  }, []);

  const loadStoredAuth = useCallback(async () => {
    try {
      console.log('🔍 Loading stored auth data...');
      
      const [sessionData, userData, parentData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.SESSION),
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.PARENT),
      ]);

      console.log('📊 Stored session exists:', !!sessionData);
      console.log('📊 Stored user exists:', !!userData);
      console.log('📊 Stored parent exists:', !!parentData);

      if (sessionData && userData) {
        const storedSession = JSON.parse(sessionData);
        const storedUser = JSON.parse(userData);
        const storedParent = parentData ? JSON.parse(parentData) : null;

        console.log('🔍 Checking session validity...');
        
        // Check if session is expired
        const expiresAt = storedSession.expires_at;
        const now = Math.floor(Date.now() / 1000);
        
        if (expiresAt && expiresAt <= now) {
          console.log('⏰ Session expired, attempting refresh...');
          
          // Try to refresh the session
          const refreshedSession = await refreshSession();
          
          if (refreshedSession) {
            console.log('✅ Session refreshed, updating stored data');
            
            let parentData = storedParent;
            if (!parentData && refreshedSession.user.id) {
              parentData = await fetchParent(refreshedSession.user.id);
            }

            setAuthState({
              user: refreshedSession.user,
              parent: parentData,
              session: refreshedSession,
              loading: false,
              error: null,
              initialized: true,
            });

            await storeAuthData(refreshedSession, refreshedSession.user, parentData || undefined);
            return;
          } else {
            console.log('❌ Session refresh failed, clearing stored data');
            await clearStoredAuth();
            setAuthState({
              user: null,
              parent: null,
              session: null,
              loading: false,
              error: null,
              initialized: true,
            });
            return;
          }
        }

        // Session is still valid, validate with Supabase
        console.log('🔍 Session appears valid, verifying with Supabase...');
        const { data: currentSession, error } = await supabase.auth.getSession();
        
        if (error) {
          console.log('❌ Session validation error:', error.message);
          await clearStoredAuth();
          setAuthState({
            user: null,
            parent: null,
            session: null,
            loading: false,
            error: null,
            initialized: true,
          });
          return;
        }

        if (currentSession.session && currentSession.session.access_token) {
          console.log('✅ Session is valid, restoring auth state');
          
          let parentData = storedParent;
          if (!parentData && currentSession.session.user.id) {
            console.log('🔍 Parent data not stored, fetching...');
            parentData = await fetchParent(currentSession.session.user.id);
          }

          setAuthState({
            user: currentSession.session.user,
            parent: parentData,
            session: currentSession.session,
            loading: false,
            error: null,
            initialized: true,
          });

          // Update stored data with fresh session if it changed
          if (currentSession.session.access_token !== storedSession.access_token) {
            await storeAuthData(currentSession.session, currentSession.session.user, parentData || undefined);
          }
        } else {
          console.log('❌ Session invalid, clearing stored data');
          await clearStoredAuth();
          setAuthState({
            user: null,
            parent: null,
            session: null,
            loading: false,
            error: null,
            initialized: true,
          });
        }
      } else {
        console.log('ℹ️ No stored auth data found');
        setAuthState({
          user: null,
          parent: null,
          session: null,
          loading: false,
          error: null,
          initialized: true,
        });
      }
    } catch (error) {
      console.error('💥 Error loading stored auth:', error);
      setAuthState({
        user: null,
        parent: null,
        session: null,
        loading: false,
        error: 'Failed to load stored authentication',
        initialized: true,
      });
    }
  }, [clearStoredAuth, fetchParent, storeAuthData, refreshSession]);

  const updateAuthState = useCallback(async (session: Session | null) => {
    if (session?.user) {
      console.log('🔄 Updating auth state with new session');
      const parent = await fetchParent(session.user.id);
      
      setAuthState({
        user: session.user,
        parent,
        session,
        loading: false,
        error: null,
        initialized: true,
      });

      await storeAuthData(session, session.user, parent || undefined);
    } else {
      console.log('🔄 Clearing auth state (no session)');
      setAuthState({
        user: null,
        parent: null,
        session: null,
        loading: false,
        error: null,
        initialized: true,
      });

      await clearStoredAuth();
    }
  }, [fetchParent, storeAuthData, clearStoredAuth]);

  // Initialize auth - only run once
  useEffect(() => {
    console.log('🚀 Initializing auth...');
    
    let authSubscription: any = null;
    
    const initAuth = async () => {
      // Load stored auth data first
      await loadStoredAuth();

      // Set up auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('🔄 Auth state changed:', event);
          
          // Handle different auth events
          switch (event) {
            case 'SIGNED_IN':
              console.log('✅ User signed in');
              await updateAuthState(session);
              break;
            case 'SIGNED_OUT':
              console.log('👋 User signed out');
              await clearStoredAuth();
              await updateAuthState(null);
              break;
            case 'TOKEN_REFRESHED':
              console.log('🔄 Token refreshed');
              await updateAuthState(session);
              break;
            case 'INITIAL_SESSION':
              // Only handle initial session if we don't have auth state yet
              if (!authState.initialized) {
                console.log('🔄 Initial session detected');
                await updateAuthState(session);
              }
              break;
            default:
              console.log(`🔄 Auth event: ${event}`);
          }
        }
      );

      authSubscription = subscription;
    };

    initAuth();

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []); // Empty dependency array - only run once

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🔐 Attempting sign in...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        console.log('❌ Sign in error:', error);
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
        return { success: false, error: error.message };
      }

      if (data.session && data.user) {
        console.log('✅ Sign in successful');
        // Don't update auth state here - let the auth listener handle it
        return { success: true, error: null, user: data.user };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      console.log('💥 Sign in exception:', errorMessage);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone?: string
  ): Promise<AuthResponse> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('📝 Attempting sign up...');
      
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            role: 'parent',
            phone: phone?.trim(),
          },
        },
      });

      if (error) {
        console.log('❌ Sign up error:', error);
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
        return { success: false, error: error.message };
      }

      if (data.user && !data.session) {
        console.log('📧 Email confirmation required');
        setAuthState(prev => ({ ...prev, loading: false }));
        return {
          success: true,
          error: null,
          user: data.user,
        };
      }

      if (data.session && data.user) {
        console.log('✅ Sign up successful with auto-confirm');
        // Let the auth listener handle the state update
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }

      return { success: true, error: null, user: data.user };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      console.log('💥 Sign up exception:', errorMessage);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async (): Promise<AuthResponse> => {
    setAuthState(prev => ({ ...prev, loading: true }));

    try {
      console.log('🚪 Signing out...');
      
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.log('❌ Sign out error:', error);
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
        return { success: false, error: error.message };
      }

      console.log('✅ Sign out successful');
      // Let the auth listener handle the cleanup
      return { success: true, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      console.log('💥 Sign out exception:', errorMessage);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

  const refreshParent = async (): Promise<void> => {
    if (authState.user) {
      console.log('🔄 Refreshing parent data...');
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
    refreshParent,
  };
};