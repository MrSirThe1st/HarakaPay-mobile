// Redux-based auth hook
import { useEffect, useCallback, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import {
  signIn,
  signUp,
  signOut,
  forgotPassword,
  updatePassword,
  refreshSession,
  fetchProfile,
  clearError,
  clearSuccess,
  updateInitialSession,
  markAsInitialized,
  setLoading,
} from "../store/authSlice";
import { supabase } from "../config/supabase";
import type { User, Session } from "@supabase/supabase-js";

export interface AuthState {
  user: User | null;
  profile: any | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  initialized: boolean;
}

export interface AuthResponse {
  success: boolean;
  error: string | null;
  user?: User | null;
}

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);
  const isProcessingAuthRef = useRef(false);

  // Set session on Supabase client whenever Redux session/user changes
  useEffect(() => {
    if (authState.session && authState.user) {
      supabase.auth.setSession(authState.session).catch((error) => {
        console.error("❌ Failed to set session on Supabase client:", error);
      });
    }
  }, [authState.session, authState.user]);

  // Check if Redux persist is still rehydrating
  const isRehydrating = useSelector(
    (state: RootState) => !state._persist?.rehydrated
  );

  // Initialize auth on mount - run only once after rehydration
  useEffect(() => {
    if (isRehydrating || authState.initialized) return;

    const initializeAuth = async () => {
      // Set a timeout to ensure we don't get stuck
      const timeoutId = setTimeout(() => {
        dispatch(markAsInitialized());
      }, 5000);

      // Set up Supabase auth state listener
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        // Prevent multiple simultaneous auth processing
        if (isProcessingAuthRef.current) return;
        isProcessingAuthRef.current = true;
        clearTimeout(timeoutId);

        switch (event) {
          case "INITIAL_SESSION":
            if (session?.user) {
              try {
                const profile = await dispatch(
                  fetchProfile(session.user.id)
                ).unwrap();

                dispatch(
                  updateInitialSession({
                    user: session.user,
                    session: session,
                    profile: profile || undefined,
                  })
                );
              } catch (error) {
                console.error("Failed to load profile:", error);
              }
            } else {
              dispatch(markAsInitialized());
            }
            break;
          case "TOKEN_REFRESHED":
            if (session) {
              await dispatch(refreshSession());
            }
            break;
        }

        isProcessingAuthRef.current = false;
      });

      return () => {
        clearTimeout(timeoutId);
        subscription.unsubscribe();
      };
    };

    initializeAuth();
  }, [dispatch, isRehydrating, authState.initialized]);

  const handleSignIn = useCallback(
    async (email: string, password: string): Promise<AuthResponse> => {
      try {
        const result = await dispatch(signIn({ email, password })).unwrap();
        return { success: true, error: null, user: result.user };
      } catch (error) {
        const errorMessage = error as string;
        return { success: false, error: errorMessage };
      }
    },
    [dispatch]
  );

  const handleSignUp = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string,
      phone?: string
    ): Promise<AuthResponse> => {
      try {
        const result = await dispatch(
          signUp({ email, password, firstName, lastName, phone })
        ).unwrap();
        return { success: true, error: null, user: result.user };
      } catch (error) {
        const errorMessage = error as string;
        return { success: false, error: errorMessage };
      }
    },
    [dispatch]
  );

  const handleSignOut = useCallback(async (): Promise<AuthResponse> => {
    try {
      await dispatch(signOut()).unwrap();
      return { success: true, error: null };
    } catch (error) {
      const errorMessage = error as string;
      return { success: false, error: errorMessage };
    }
  }, [dispatch]);

  const handleForgotPassword = useCallback(
    async (email: string): Promise<AuthResponse> => {
      try {
        await dispatch(forgotPassword({ email })).unwrap();
        return { success: true, error: null };
      } catch (error) {
        const errorMessage = error as string;
        return { success: false, error: errorMessage };
      }
    },
    [dispatch]
  );

  const handleUpdatePassword = useCallback(
    async (newPassword: string): Promise<AuthResponse> => {
      try {
        await dispatch(updatePassword({ newPassword })).unwrap();
        return { success: true, error: null };
      } catch (error) {
        const errorMessage = error as string;
        return { success: false, error: errorMessage };
      }
    },
    [dispatch]
  );

  const handleRefreshProfile = useCallback(async (): Promise<void> => {
    if (authState.user) {
      await dispatch(fetchProfile(authState.user.id));
    }
  }, [dispatch, authState.user]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleClearSuccess = useCallback(() => {
    dispatch(clearSuccess());
  }, [dispatch]);

  return {
    ...authState,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    forgotPassword: handleForgotPassword,
    updatePassword: handleUpdatePassword,
    refreshProfile: handleRefreshProfile,
    clearError: handleClearError,
    clearSuccess: handleClearSuccess,
    isParent: authState.profile?.role === 'parent',
  };
};
