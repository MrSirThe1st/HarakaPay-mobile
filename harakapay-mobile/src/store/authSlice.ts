import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
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

const initialState: AuthState = {
  user: null,
  parent: null,
  session: null,
  loading: false,
  error: null,
  success: false,
  initialized: false,
};

// Async thunk for fetching parent data
export const fetchParent = createAsyncThunk(
  "auth/fetchParent",
  async (userId: string, thunkAPI) => {
    try {
      const { data, error } = await supabase
        .from("parents")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        return thunkAPI.rejectWithValue("Failed to fetch parent data");
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch parent data");
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
        // Fetch parent data
        const parent = await thunkAPI
          .dispatch(fetchParent(data.user.id))
          .unwrap();

        // Don't manually store to AsyncStorage - let Redux persist handle it
        return {
          session: data.session,
          user: data.user,
          parent,
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
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            role: "parent",
            phone: phone?.trim(),
          },
        },
      });

      if (error) {
        return thunkAPI.rejectWithValue(error.message);
      }

      if (data.user && !data.session) {
        // Email confirmation required
        return { user: data.user, requiresConfirmation: true };
      }

      if (data.session && data.user) {
        // Auto-confirm enabled
        const parent = await thunkAPI
          .dispatch(fetchParent(data.user.id))
          .unwrap();

        // Don't manually store to AsyncStorage - let Redux persist handle it
        return {
          session: data.session,
          user: data.user,
          parent,
          requiresConfirmation: false,
        };
      }

      return thunkAPI.rejectWithValue("Registration failed");
    } catch (error) {
      return thunkAPI.rejectWithValue("An error occurred during registration");
    }
  }
);

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
      return thunkAPI.rejectWithValue("Password reset failed");
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

    // Don't manually clear AsyncStorage - let Redux persist handle it
    return true;
  } catch (error) {
    return thunkAPI.rejectWithValue("Sign out failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.initialized = action.payload;
    },
    updateParent: (state, action: PayloadAction<Parent>) => {
      state.parent = action.payload;
    },
    updateInitialSession: (
      state,
      action: PayloadAction<{
        user: User | null;
        session: Session | null;
        parent?: Parent | null;
      }>
    ) => {
      state.user = action.payload.user;
      state.session = action.payload.session;
      state.parent = action.payload.parent || null;
      state.initialized = true;
      state.loading = false;
      state.error = null;
    },
    markAsInitialized: (state) => {
      state.initialized = true;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign in
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.parent = action.payload.parent;
        state.session = action.payload.session;
        state.error = null;
        state.success = true;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      // Sign up
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.requiresConfirmation) {
          state.user = action.payload.user;
          state.success = true;
        } else {
          state.user = action.payload.user;
          state.parent = action.payload.parent;
          state.session = action.payload.session;
          state.success = true;
        }
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      // Forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      // Sign out
      .addCase(signOut.pending, (state) => {
        state.loading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.parent = null;
        state.session = null;
        state.error = null;
        state.success = false;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch parent
      .addCase(fetchParent.fulfilled, (state, action) => {
        state.parent = action.payload;
      })
      // Refresh session
      .addCase(refreshSession.fulfilled, (state, action) => {
        state.session = action.payload;
        if (action.payload?.user) {
          state.user = action.payload.user;
        }
      });
  },
});

export const {
  clearError,
  clearSuccess,
  setInitialized,
  updateParent,
  updateInitialSession,
  markAsInitialized,
} = authSlice.actions;
export default authSlice.reducer;
