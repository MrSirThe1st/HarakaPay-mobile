// Supabase types (shared with web portal)
export interface SupabaseUser {
  id: string;
  email: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          first_name: string | null;
          last_name: string | null;
          role: "super_admin" | "platform_admin" | "support_admin" | "school_admin" | "school_staff" | "parent";
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
        };
        Insert: {
          id?: string;
          user_id: string;
          first_name?: string | null;
          last_name?: string | null;
          role: "super_admin" | "platform_admin" | "support_admin" | "school_admin" | "school_staff" | "parent";
          admin_type?: "super_admin" | "platform_admin" | "support_admin" | null;
          school_id?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          avatar_url?: string | null;
          permissions?: Record<string, unknown> | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          first_name?: string | null;
          last_name?: string | null;
          role?: "super_admin" | "platform_admin" | "support_admin" | "school_admin" | "school_staff" | "parent";
          admin_type?: "super_admin" | "platform_admin" | "support_admin" | null;
          school_id?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          avatar_url?: string | null;
          permissions?: Record<string, unknown> | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      schools: {
        Row: {
          id: string;
          name: string;
          address: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          registration_number: string | null;
          status: "pending" | "pending_verification" | "approved" | "suspended";
          verification_status: "pending" | "verified" | "rejected";
          verification_date: string | null;
          verified_by: string | null;
          payment_transparency: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          registration_number?: string | null;
          status?: "pending" | "pending_verification" | "approved" | "suspended";
          verification_status?: "pending" | "verified" | "rejected";
          verification_date?: string | null;
          verified_by?: string | null;
          payment_transparency?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          registration_number?: string | null;
          status?: "pending" | "pending_verification" | "approved" | "suspended";
          verification_status?: "pending" | "verified" | "rejected";
          verification_date?: string | null;
          verified_by?: string | null;
          payment_transparency?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
      };
      students: {
        Row: {
          id: string;
          school_id: string;
          student_id: string;
          first_name: string;
          last_name: string;
          grade_level: string | null;
          enrollment_date: string;
          status: "active" | "inactive" | "graduated";
          parent_name: string | null;
          parent_phone: string | null;
          parent_email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          student_id: string;
          first_name: string;
          last_name: string;
          grade_level?: string | null;
          enrollment_date?: string;
          status?: "active" | "inactive" | "graduated";
          parent_name?: string | null;
          parent_phone?: string | null;
          parent_email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          student_id?: string;
          first_name?: string;
          last_name?: string;
          grade_level?: string | null;
          enrollment_date?: string;
          status?: "active" | "inactive" | "graduated";
          parent_name?: string | null;
          parent_phone?: string | null;
          parent_email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: "super_admin" | "platform_admin" | "support_admin" | "school_admin" | "school_staff" | "parent";
      admin_type: "super_admin" | "platform_admin" | "support_admin";
      school_status: "pending" | "pending_verification" | "approved" | "suspended";
      verification_status: "pending" | "verified" | "rejected";
      payment_status: "pending" | "completed" | "failed" | "refunded";
      payment_method: "cash" | "bank_transfer" | "mobile_money" | "card";
      student_status: "active" | "inactive" | "graduated";
      notification_type: "info" | "success" | "warning" | "error";
      workflow_status: "pending" | "approved" | "rejected" | "cancelled";
      relationship_type: "parent" | "guardian" | "emergency_contact";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
