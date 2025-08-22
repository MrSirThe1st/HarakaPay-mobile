import { store } from "../store";
import { signOut } from "../store/authSlice";

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
    return state.auth.parent;
  }

  static isAuthenticated(): boolean {
    const state = store.getState();
    return !!(state.auth.user && state.auth.session);
  }

  static async logout() {
    await store.dispatch(signOut());
  }

  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
