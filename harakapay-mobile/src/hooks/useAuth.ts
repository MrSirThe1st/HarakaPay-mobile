// Redux-based auth hook
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import {
  signIn,
  signUp,
  signOut,
  forgotPassword,
  refreshSession,
  fetchParent,
  clearError,
  clearSuccess,
  updateInitialSession,
  markAsInitialized,
} from "../store/authSlice";
import { supabase } from "../config/supabase";
import type { User, Session } from "@supabase/supabase-js";

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

  // Check if Redux persist is still rehydrating
  const isRehydrating = useSelector(
    (state: RootState) => !state._persist?.rehydrated
  );

  // Initialize auth on mount
  useEffect(() => {
    // Wait for Redux persist to finish rehydrating
    if (isRehydrating) {
      console.log("⏳ Waiting for Redux persist rehydration...");
      return;
    }

    const initializeAuth = async () => {
      console.log("🚀 Initializing auth...");

      // Check if we already have auth data from Redux persist
      if (authState.user && authState.session) {
        console.log(
          "✅ Already have auth data from Redux persist, skipping initialization"
        );
        dispatch(markAsInitialized());
        return;
      }

      // Set a timeout to ensure we don't get stuck
      const timeoutId = setTimeout(() => {
        console.log("⏰ Auth initialization timeout, marking as initialized");
        dispatch(markAsInitialized());
      }, 5000); // 5 second timeout

      // Don't manually load stored auth - let Redux persist handle it
      console.log("ℹ️ Letting Redux persist handle stored auth data");

      // Set up auth state listener
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log(
          "🔄 Auth state changed:",
          event,
          "Session exists:",
          !!session
        );

        // Clear timeout when we get any auth event
        clearTimeout(timeoutId);

        switch (event) {
          case "INITIAL_SESSION":
            console.log("🔄 Initial session detected");
            if (session?.user) {
              console.log("✅ Initial session has user, updating state");
              // Fetch parent data and update Redux state
              try {
                const parent = await dispatch(
                  fetchParent(session.user.id)
                ).unwrap();

                // Update Redux state with the initial session
                dispatch(
                  updateInitialSession({
                    user: session.user,
                    session: session,
                    parent: parent || undefined,
                  })
                );

                console.log("✅ Initial session state updated successfully");
              } catch (error) {
                console.log(
                  "⚠️ Failed to update initial session state:",
                  error
                );
              }
            } else {
              console.log("ℹ️ Initial session has no user");
              // If no initial session, mark as initialized so we can show auth screen
              dispatch(markAsInitialized());
            }
            break;
          case "SIGNED_IN":
            console.log("✅ User signed in");
            if (session?.user) {
              const parent = await dispatch(
                fetchParent(session.user.id)
              ).unwrap();
              // Don't manually update storage - let Redux persist handle it
            }
            break;
          case "SIGNED_OUT":
            console.log("👋 User signed out");
            break;
          case "TOKEN_REFRESHED":
            console.log("🔄 Token refreshed");
            if (session) {
              await dispatch(refreshSession());
            }
            break;
          default:
            console.log(`🔄 Auth event: ${event}`);
        }
      });

      return () => {
        clearTimeout(timeoutId);
        subscription.unsubscribe();
      };
    };

    initializeAuth();
  }, [dispatch, isRehydrating, authState.user, authState.session]);

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

  const handleRefreshParent = useCallback(async (): Promise<void> => {
    if (authState.user) {
      await dispatch(fetchParent(authState.user.id));
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
    refreshParent: handleRefreshParent,
    clearError: handleClearError,
    clearSuccess: handleClearSuccess,
  };
};
