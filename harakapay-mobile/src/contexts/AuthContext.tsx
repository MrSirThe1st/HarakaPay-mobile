import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../config/supabase';
import type { User, Session } from '@supabase/supabase-js';
import { UserProfile } from '../types/auth';
import { createParentProfile } from '../services/parentProfileService';

export interface AuthResponse {
  success: boolean;
  error: string | null;
  user?: User | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => Promise<AuthResponse>;
  signOut: () => Promise<AuthResponse>;
  forgotPassword: (email: string) => Promise<AuthResponse>;
  updatePassword: (newPassword: string) => Promise<AuthResponse>;
  fetchProfile: (userId: string) => Promise<UserProfile | null>;
  clearError: () => void;
  clearSuccess: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Fetch user profile from database
  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'parent')
        .maybeSingle();

      if (error) {
        console.error('Profile fetch error:', error.message);
        setError(`Profile fetch failed: ${error.message}`);
        return null;
      }

      if (!data) {
        setError('Parent profile not found');
        return null;
      }

      return data as UserProfile;
    } catch (err) {
      console.error('Profile fetch exception:', err);
      setError(`Profile fetch failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return null;
    }
  };

  // Initialize auth state from Supabase session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);

          // Fetch profile
          const userProfile = await fetchProfile(currentSession.user.id);
          setProfile(userProfile);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state change:', event);

        // Skip TOKEN_REFRESHED during initial load - let initializeAuth handle it
        if (event === 'TOKEN_REFRESHED' && !initialized) {
          console.log('Skipping TOKEN_REFRESHED during initialization');
          return;
        }

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          const userProfile = await fetchProfile(currentSession.user.id);
          setProfile(userProfile);
        } else {
          setProfile(null);
        }

        // Ensure initialized is set for non-initial events
        if (event !== 'INITIAL_SESSION') {
          setInitialized(true);
        }
      }
    );

    // Proactive token refresh - check every 10 minutes
    const refreshInterval = setInterval(async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();

        if (currentSession && !error) {
          // Check if token expires in less than 30 minutes
          const expiresAt = currentSession.expires_at;
          if (expiresAt) {
            const expiryTime = expiresAt * 1000; // Convert to milliseconds
            const timeUntilExpiry = expiryTime - Date.now();
            const thirtyMinutes = 30 * 60 * 1000;

            if (timeUntilExpiry < thirtyMinutes) {
              console.log('Token expiring soon, refreshing proactively...');
              await supabase.auth.refreshSession();
            }
          }
        }
      } catch (err) {
        console.error('Background refresh error:', err);
      }
    }, 10 * 60 * 1000); // Check every 10 minutes

    return () => {
      subscription.unsubscribe();
      clearInterval(refreshInterval);
    };
  }, []);

  // Transform 6-digit PIN to valid Supabase password
  const transformPinToPassword = (pin: string): string => {
    // If it's already a longer password, return as-is
    if (pin.length > 6) {
      return pin;
    }
    // If it's a 6-digit PIN, transform to meet Supabase requirements
    // Format: HP{pin}@Sec (e.g., HP123456@Sec = 12 chars with upper, lower, digit, special)
    return `HP${pin}@Sec`;
  };

  // Sign in
  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const transformedPassword = transformPinToPassword(password);

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: transformedPassword,
      });

      if (signInError) {
        setError(signInError.message);
        return { success: false, error: signInError.message };
      }

      if (data.session && data.user) {
        setSession(data.session);
        setUser(data.user);

        // Fetch profile
        const userProfile = await fetchProfile(data.user.id);
        setProfile(userProfile);
        setSuccess(true);
        return { success: true, error: null, user: data.user };
      } else {
        setError('Login failed');
        return { success: false, error: 'Login failed' };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during login';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Sign up
  const signUp = async ({
    email,
    password,
    firstName,
    lastName,
    phone,
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const transformedPassword = transformPinToPassword(password);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password: transformedPassword,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phone || '',
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return { success: false, error: signUpError.message };
      }

      if (data.user && data.session) {
        setUser(data.user);
        setSession(data.session);

        // Create parent profile
        try {
          const profileResult = await createParentProfile({
            user_id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            phone: phone || '',
            email: email.toLowerCase().trim(),
          });

          if (profileResult.success && profileResult.profile) {
            setProfile(profileResult.profile as UserProfile);
          } else {
            console.warn('Profile creation failed, but user account created');
            setProfile(null);
          }
        } catch (profileError) {
          console.error('Failed to create parent profile:', profileError);
          setProfile(null);
        }

        setSuccess(true);
        return { success: true, error: null, user: data.user };
      } else {
        setError('Registration failed');
        return { success: false, error: 'Registration failed' };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during registration';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async (): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);

      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        setError(signOutError.message);
        return { success: false, error: signOutError.message };
      }

      setUser(null);
      setSession(null);
      setProfile(null);
      setSuccess(false);
      return { success: true, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during logout';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (email: string): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);

      const redirectUrl = 'harakapay://reset-password';
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (resetError) {
        setError(resetError.message);
        return { success: false, error: resetError.message };
      }

      setSuccess(true);
      return { success: true, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during password reset';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updatePassword = async (newPassword: string): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);

      const transformedPassword = transformPinToPassword(newPassword);

      const { error: updateError } = await supabase.auth.updateUser({
        password: transformedPassword,
      });

      if (updateError) {
        setError(updateError.message);
        return { success: false, error: updateError.message };
      }

      setSuccess(true);
      return { success: true, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while updating password';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(false);

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    error,
    success,
    initialized,
    signIn,
    signUp,
    signOut,
    forgotPassword,
    updatePassword,
    fetchProfile,
    clearError,
    clearSuccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
