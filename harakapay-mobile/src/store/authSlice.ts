import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../config/supabase";
import type { User, Session } from "@supabase/supabase-js";
import { UserProfile } from "../types/auth";
import { createParentProfile } from "../services/parentProfileService";

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  profile: null,
  session: null,
  loading: false,
  error: null,
  success: false,
  initialized: false,
};

// Async thunk for fetching user profile data
export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (userId: string, thunkAPI) => {
    try {
      console.log("🔍 Fetching profile for user:", userId);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .eq("role", "parent")
        .maybeSingle();

      if (error) {
        console.error("❌ Profile fetch error:", error);
        return thunkAPI.rejectWithValue(`Profile fetch failed: ${error.message}`);
      }

      if (!data) {
        console.log("⚠️ No parent profile found for user:", userId);
        
        // Try to create a profile for existing users who don't have one
        console.log("🔄 Attempting to create profile for existing user...");
        
        // Get user data from auth
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          return thunkAPI.rejectWithValue("No user session found");
        }

        // Create profile using the manual API approach
        const profileResult = await createParentProfile({
          user_id: userId,
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          email: user.email || '',
          phone: user.user_metadata?.phone || '',
        });

        if (!profileResult.success) {
          console.error("❌ Failed to create profile for existing user:", profileResult.error);
          return thunkAPI.rejectWithValue(profileResult.error || "Failed to create profile");
        }

        console.log("✅ Profile created for existing user:", profileResult.profile?.id);
        return profileResult.profile;
      }

      console.log("✅ Profile found:", data);
      return data;
    } catch (error) {
      console.error("💥 Profile fetch exception:", error);
      return thunkAPI.rejectWithValue(`Profile fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

// Async thunk for refreshing session
export const refreshSession = createAsyncThunk(
  "auth/refreshSession",
  async (_, thunkAPI) => {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        return thunkAPI.rejectWithValue("Session refresh failed");
      }

      return data.session;
    } catch (error) {
      return thunkAPI.rejectWithValue("Session refresh failed");
    }
  }
);

// Async thunk for sign in
export const signIn = createAsyncThunk(
  "auth/signIn",
  async (
    { email, password }: { email: string; password: string },
    thunkAPI
  ) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        return thunkAPI.rejectWithValue(error.message);
      }

      if (data.session && data.user) {
        // Fetch profile data
        const profile = await thunkAPI
          .dispatch(fetchProfile(data.user.id))
          .unwrap();

        return {
          session: data.session,
          user: data.user,
          profile,
        };
      }

      return thunkAPI.rejectWithValue("Login failed");
    } catch (error) {
      return thunkAPI.rejectWithValue("An error occurred during login");
    }
  }
);

// Async thunk for sign up
export const signUp = createAsyncThunk(
  "auth/signUp",
  async (
    {
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
    },
    thunkAPI
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phone || '',
          }
        }
      });

      if (error) {
        return thunkAPI.rejectWithValue(error.message);
      }

      if (data.user && data.session) {
        console.log("✅ User created successfully, creating parent profile...");

        // Create parent profile using the manual API approach
        try {
          const profileResult = await createParentProfile({
            user_id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            phone: phone || '',
            email: email.toLowerCase().trim(),
          });

          if (!profileResult.success) {
            throw new Error(profileResult.error || 'Failed to create profile');
          }

          console.log("✅ Signup completed successfully with profile and session");
          return {
            user: data.user,
            session: data.session,
            profile: profileResult.profile,
          };
        } catch (profileError) {
          console.error("❌ Failed to create parent profile:", profileError);
          // Return user and session without profile - they can complete it later
          return {
            user: data.user,
            session: data.session,
            profile: null,
          };
        }
      }

      return thunkAPI.rejectWithValue("Registration failed");
    } catch (error) {
      return thunkAPI.rejectWithValue("An error occurred during registration");
    }
  }
);

// Async thunk for sign out
export const signOut = createAsyncThunk("auth/signOut", async (_, thunkAPI) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return thunkAPI.rejectWithValue(error.message);
    }

    return true;
  } catch (error) {
    return thunkAPI.rejectWithValue("An error occurred during logout");
  }
});

// Async thunk for forgot password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }: { email: string }, thunkAPI) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        return thunkAPI.rejectWithValue(error.message);
      }

      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue("An error occurred during password reset");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    updateInitialSession: (
      state,
      action: PayloadAction<{
        user: User;
        session: Session;
        profile?: UserProfile;
      }>
    ) => {
      state.user = action.payload.user;
      state.session = action.payload.session;
      state.profile = action.payload.profile || null;
      state.loading = false;
      state.error = null;
    },
    markAsInitialized: (state) => {
      state.initialized = true;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Refresh session
    builder
      .addCase(refreshSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshSession.fulfilled, (state, action) => {
        state.loading = false;
        state.session = action.payload;
        state.error = null;
      })
      .addCase(refreshSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Sign in
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.profile = action.payload.profile;
        state.error = null;
        state.success = true;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });

    // Sign up
    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.profile = action.payload.profile;
        state.error = null;
        state.success = true;
        state.initialized = true;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });

    // Sign out
    builder
      .addCase(signOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.profile = null;
        state.session = null;
        state.error = null;
        state.success = false;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Forgot password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setLoading,
  clearError,
  clearSuccess,
  updateInitialSession,
  markAsInitialized,
} = authSlice.actions;

export default authSlice.reducer;