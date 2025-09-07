// Auth types - aligned with web version
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
  created_at: string;
  updated_at: string;
}

export type UserRole = 
  | "super_admin" 
  | "platform_admin" 
  | "support_admin" 
  | "school_admin" 
  | "school_staff"
  | "parent";

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  admin_type: "super_admin" | "platform_admin" | "support_admin" | null;
  school_id: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  avatar_url: string | null;
  permissions: Record<string, unknown> | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}
