import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
interface User {
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  success: false,
};
export const login = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    thunkAPI
  ) => {
    // TODO: Replace with real API call
    try {
      // Simulate API call
      const fakeToken = 'jwt-token';
      const fakeUser = { email };
      await AsyncStorage.setItem('user', JSON.stringify(fakeUser));
      await AsyncStorage.setItem('token', fakeToken);
      return { user: fakeUser, token: fakeToken };
    } catch (error) {
      return thunkAPI.rejectWithValue('Login failed');
    }
  }
);
export const register = createAsyncThunk(
  'auth/register',
  async (
    { email, password, name }: { email: string; password: string; name: string },
    thunkAPI
  ) => {
    // TODO: Replace with real API call
    try {
      const fakeToken = 'jwt-token';
      const fakeUser = { email, name };
      await AsyncStorage.setItem('user', JSON.stringify(fakeUser));
      await AsyncStorage.setItem('token', fakeToken);
      return { user: fakeUser, token: fakeToken };
    } catch (error) {
      return thunkAPI.rejectWithValue('Registration failed');
    }
  }
);
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (
    { email }: { email: string },
    thunkAPI
  ) => {
    // TODO: Replace with real API call
    try {
      // Simulate success
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue('Password reset failed');
    }
  }
);
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.success = false;
      AsyncStorage.removeItem('user');
      AsyncStorage.removeItem('token');
    },
    loadSession: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});
export const { logout, loadSession } = authSlice.actions;
export const loadUserSession = () => async (dispatch: any) => {
  try {
    const user = await AsyncStorage.getItem('user');
    const token = await AsyncStorage.getItem('token');
    if (user && token) {
      dispatch(loadSession({ user: JSON.parse(user), token }));
    }
  } catch (e) {
    // handle error
  }
};
export default authSlice.reducer;
