// Student types
export interface Student {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  grade_level?: string;
  enrollment_date: string;
  status: 'active' | 'inactive' | 'graduated';
  parent_name?: string;
  parent_phone?: string;
  parent_email?: string;
  school_id: string;
  created_at: string;
  updated_at: string;
}
