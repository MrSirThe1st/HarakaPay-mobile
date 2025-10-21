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

export interface StudentLookupResult {
  found: boolean;
  student?: {
    id: string;
    student_id: string;
    first_name: string;
    last_name: string;
    grade_level: string | null;
    school_id: string;
    school_name: string;
    parent_name: string | null;
    parent_email: string | null;
    parent_phone: string | null;
  };
  error?: string;
}

export interface StudentToLink {
  school_id: string;
  student_id: string;
}

export interface BatchLinkResult {
  success: boolean;
  linked_students: Array<{
    id: string;
    student_id: string;
    first_name: string;
    last_name: string;
    grade_level: string | null;
    school_id: string;
    relationship_id: string;
  }>;
  errors: Array<{
    school_id: string;
    student_id: string;
    error: string;
  }>;
  summary: {
    total_requested: number;
    successfully_linked: number;
    failed: number;
  };
}
