
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './env';

// Complete Supabase types for mobile app
export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

// Legacy interface for backwards compatibility
export interface SupabaseUser {
	id: string;
	email: string;
}

// Main Database interface
export interface Database {
	public: {
		Tables: {
			parents: {
				Row: {
					id: string;
					user_id: string;
					first_name: string;
					last_name: string;
					phone: string | null;
					email: string | null;
					address: string | null;
					national_id: string | null;
					avatar_url: string | null;
					notification_preferences: Json | null;
					payment_preferences: Json | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					first_name: string;
					last_name: string;
					phone?: string | null;
					email?: string | null;
					address?: string | null;
					national_id?: string | null;
					avatar_url?: string | null;
					notification_preferences?: Json | null;
					payment_preferences?: Json | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					first_name?: string;
					last_name?: string;
					phone?: string | null;
					email?: string | null;
					address?: string | null;
					national_id?: string | null;
					avatar_url?: string | null;
					notification_preferences?: Json | null;
					payment_preferences?: Json | null;
					created_at?: string;
					updated_at?: string;
				};
			};
			parent_students: {
				Row: {
					id: string;
					parent_id: string;
					student_id: string;
					relationship_type: string | null;
					is_primary: boolean | null;
					can_make_payments: boolean | null;
					can_receive_notifications: boolean | null;
					created_at: string;
				};
				Insert: {
					id?: string;
					parent_id: string;
					student_id: string;
					relationship_type?: string | null;
					is_primary?: boolean | null;
					can_make_payments?: boolean | null;
					can_receive_notifications?: boolean | null;
					created_at?: string;
				};
				Update: {
					id?: string;
					parent_id?: string;
					student_id?: string;
					relationship_type?: string | null;
					is_primary?: boolean | null;
					can_make_payments?: boolean | null;
					can_receive_notifications?: boolean | null;
					created_at?: string;
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
					date_of_birth: string | null;
					gender: "male" | "female" | "other" | null;
					avatar_url: string | null;
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
					date_of_birth?: string | null;
					gender?: "male" | "female" | "other" | null;
					avatar_url?: string | null;
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
					date_of_birth?: string | null;
					gender?: "male" | "female" | "other" | null;
					avatar_url?: string | null;
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
					status: "pending" | "approved" | "suspended";
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
					status?: "pending" | "approved" | "suspended";
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
					status?: "pending" | "approved" | "suspended";
					created_at?: string;
					updated_at?: string;
				};
			};
			payments: {
				Row: {
					id: string;
					student_id: string;
					parent_id: string | null;
					amount: number;
					payment_date: string;
					payment_method: "cash" | "bank_transfer" | "mobile_money" | "m_pesa" | "airtel_money" | "orange_money" | null;
					status: "pending" | "completed" | "failed" | "cancelled";
					description: string | null;
					transaction_reference: string | null;
					payment_gateway_response: Json | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					student_id: string;
					parent_id?: string | null;
					amount: number;
					payment_date?: string;
					payment_method?: "cash" | "bank_transfer" | "mobile_money" | "m_pesa" | "airtel_money" | "orange_money" | null;
					status?: "pending" | "completed" | "failed" | "cancelled";
					description?: string | null;
					transaction_reference?: string | null;
					payment_gateway_response?: Json | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					student_id?: string;
					parent_id?: string | null;
					amount?: number;
					payment_date?: string;
					payment_method?: "cash" | "bank_transfer" | "mobile_money" | "m_pesa" | "airtel_money" | "orange_money" | null;
					status?: "pending" | "completed" | "failed" | "cancelled";
					description?: string | null;
					transaction_reference?: string | null;
					payment_gateway_response?: Json | null;
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
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}

// Convenience types for mobile app usage
export type Parent = Database['public']['Tables']['parents']['Row'];
export type ParentInsert = Database['public']['Tables']['parents']['Insert'];
export type ParentUpdate = Database['public']['Tables']['parents']['Update'];

export type ParentStudent = Database['public']['Tables']['parent_students']['Row'];
export type ParentStudentInsert = Database['public']['Tables']['parent_students']['Insert'];
export type ParentStudentUpdate = Database['public']['Tables']['parent_students']['Update'];

export type Student = Database['public']['Tables']['students']['Row'];
export type StudentInsert = Database['public']['Tables']['students']['Insert'];
export type StudentUpdate = Database['public']['Tables']['students']['Update'];

export type School = Database['public']['Tables']['schools']['Row'];
export type SchoolInsert = Database['public']['Tables']['schools']['Insert'];
export type SchoolUpdate = Database['public']['Tables']['schools']['Update'];

export type Payment = Database['public']['Tables']['payments']['Row'];
export type PaymentInsert = Database['public']['Tables']['payments']['Insert'];
export type PaymentUpdate = Database['public']['Tables']['payments']['Update'];

// Enhanced types with relationships for mobile app features
export type ParentWithChildren = Parent & {
	children?: (ParentStudent & { 
		student: Student & { 
			school: School;
		};
	})[];
};

export type StudentWithSchool = Student & {
	school: School;
};

export type PaymentWithDetails = Payment & {
	student: StudentWithSchool;
	parent?: Parent;
};

// Mobile-specific preference types
export interface NotificationPreferences {
	email: boolean;
	sms: boolean;
	push: boolean;
	fee_reminders?: boolean;
	payment_confirmations?: boolean;
	school_announcements?: boolean;
	reminder_frequency?: 'daily' | 'weekly' | 'monthly';
}

export interface PaymentPreferences {
	preferred_method: 'm_pesa' | 'airtel_money' | 'orange_money' | 'bank_transfer' | null;
	auto_pay: boolean;
	payment_reminders?: boolean;
	default_amount?: number;
	save_payment_info?: boolean;
}

// Mobile app specific types
export interface DashboardStats {
	total_children: number;
	total_due: number;
	overdue_payments: number;
	recent_payments: number;
}

export interface ChildSummary {
	student: StudentWithSchool;
	total_due: number;
	last_payment_date?: string;
	payment_status: 'up_to_date' | 'due' | 'overdue';
	notifications_count: number;
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
