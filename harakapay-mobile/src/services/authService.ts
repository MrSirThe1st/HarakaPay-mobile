import { store } from "../store";
import { signOut, signUp } from "../store/authSlice";
import { supabase } from "../config/supabase";

export class AuthService {
  static getToken(): string | null {
    const state = store.getState();
    return state.auth.session?.access_token || null;
  }

  static getUser() {
    const state = store.getState();
    return state.auth.user;
  }

  static getParent() {
    const state = store.getState();
    return state.auth.profile;
  }

  static isAuthenticated(): boolean {
    const state = store.getState();
    return !!(state.auth.user && state.auth.session && state.auth.profile);
  }

  static async logout() {
    await store.dispatch(signOut());
  }

  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Enhanced registration method
  static async registerParent(parentData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
  }) {
    try {
      console.log('🔄 Starting parent registration...');
      
      // Use the Redux action for consistency
      const result = await store.dispatch(signUp({
        email: parentData.email,
        password: parentData.password,
        firstName: parentData.firstName,
        lastName: parentData.lastName,
        phone: parentData.phone,
      }));

      if (signUp.fulfilled.match(result)) {
        console.log('✅ Registration successful');
        return {
          success: true,
          user: result.payload.user,
          parent: result.payload.profile,
          message: 'Registration successful! Please check your email to verify your account.'
        };
      } else {
        console.error('❌ Registration failed:', result.payload);
        return {
          success: false,
          error: result.payload as string || 'Registration failed. Please try again.'
        };
      }
    } catch (error) {
      console.error('💥 Registration error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed. Please try again.'
      };
    }
  }

  // Method to check if user has complete profile
  static hasCompleteProfile(): boolean {
    const parent = this.getParent();
    return !!(parent && parent.first_name && parent.last_name);
  }
}
