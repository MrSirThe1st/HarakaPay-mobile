// Student business logic
import { Student, StudentLookupResult, StudentToLink, BatchLinkResult } from '../types/student';
import { fetchStudents, fetchStudentById, updateStudent } from '../api/studentApi';
import { supabase } from '../config/supabase';
import { WEB_API_URL } from '../config/env';

export const getStudents = async (parentId: string): Promise<Student[]> => {
  try {
    return await fetchStudents(parentId);
  } catch (error) {
    console.error('Error fetching students:', error);
    throw new Error('Failed to fetch students');
  }
};

export const getStudentById = async (studentId: string): Promise<Student | null> => {
  try {
    return await fetchStudentById(studentId);
  } catch (error) {
    console.error('Error fetching student:', error);
    throw new Error('Failed to fetch student');
  }
};

export const updateStudentInfo = async (studentId: string, updates: Partial<Student>): Promise<Student | null> => {
  try {
    return await updateStudent(studentId, updates);
  } catch (error) {
    console.error('Error updating student:', error);
    throw new Error('Failed to update student');
  }
};

// Look up a student by school ID and student number
export const lookupStudentByNumber = async (schoolId: string, studentId: string): Promise<StudentLookupResult> => {
  try {
    console.log('🔍 Looking up student:', { schoolId, studentId });
    
    const API_URL = WEB_API_URL;
    const response = await fetch(`${API_URL}/api/parent/lookup-student`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        school_id: schoolId,
        student_id: studentId.trim()
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Student lookup failed:', result.error);
      return {
        found: false,
        error: result.error || 'Failed to lookup student'
      };
    }

    console.log('✅ Student lookup result:', result);
    return result;

  } catch (error) {
    console.error('💥 Student lookup exception:', error);
    return {
      found: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Link multiple students to parent account using the same endpoint as manual linking
export const linkStudentsBatch = async (students: StudentToLink[]): Promise<BatchLinkResult> => {
  try {
    console.log('🔗 Linking students batch:', students);

    // Wait briefly for auth session to be available right after sign-up
    const getTokenWithRetry = async (): Promise<string> => {
      const maxAttempts = 10; // ~2s total at 200ms interval
      const delayMs = 200;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        if (token) return token;
        await new Promise(res => setTimeout(res, delayMs));
      }
      throw new Error('No authentication token available');
    };

    const token = await getTokenWithRetry();

    // Wait for parent record to be created in the database
    // This ensures the parent record exists before we try to link students
    const waitForParentRecord = async (): Promise<void> => {
      const maxAttempts = 15; // ~3s total at 200ms interval
      const delayMs = 200;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const response = await fetch(`${WEB_API_URL}/api/parent/linked-students`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          // If we get a 200, the parent record exists (even if no students are linked)
          if (response.status === 200) {
            const data = await response.json();
            console.log('✅ Parent record confirmed, parent_id:', data.parent_id);
            return;
          }
          
          // If we get 404, the parent record doesn't exist yet, keep waiting
          if (response.status === 404) {
            console.log(`⏳ Waiting for parent record (attempt ${attempt}/${maxAttempts})...`);
          }
        } catch (error) {
          // Continue retrying
          console.log(`⏳ Waiting for parent record (attempt ${attempt}/${maxAttempts})...`);
        }
        await new Promise(res => setTimeout(res, delayMs));
      }
      console.log('⚠️ Parent record check timeout, proceeding anyway...');
    };

    await waitForParentRecord();

    // Use server-side batch endpoint to handle lookup and linking atomically
    const response = await fetch(`${WEB_API_URL}/api/parent/link-students-batch`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ students }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Batch linking failed:', result);
      return {
        success: false,
        linked_students: [],
        errors: students.map(s => ({ school_id: s.school_id, student_id: s.student_id, error: result.error || 'Batch linking failed' })),
        summary: { total_requested: students.length, successfully_linked: 0, failed: students.length }
      };
    }

    console.log('✅ Batch linking result:', result);
    return result as BatchLinkResult;

  } catch (error) {
    console.error('💥 Batch linking error:', error);
    throw error;
  }
};
