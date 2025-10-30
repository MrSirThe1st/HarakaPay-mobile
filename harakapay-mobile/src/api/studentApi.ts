// Student API service
import { Student } from '../types/student';
import { supabase } from '../config/supabase';
import { WEB_API_URL } from '../config/env';
import type { Session } from '@supabase/supabase-js';

export interface LinkedStudent extends Student {
  school_name?: string;
  match_confidence?: 'high' | 'medium' | 'low';
  match_reasons?: string[];
}

export interface StudentMatch extends Student {
  school_name?: string;
  match_confidence: 'high' | 'medium' | 'low';
  match_reasons: string[];
}

// Fetch students linked to the current parent
export const fetchLinkedStudents = async (session?: Session | null): Promise<LinkedStudent[]> => {
  try {
    console.log('🔍 fetchLinkedStudents: Starting API call');
    
    // Use passed session or fallback to Supabase
    let authSession = session;
    if (!authSession) {
      const { data: { session: supabaseSession } } = await supabase.auth.getSession();
      authSession = supabaseSession;
    }
    
    if (!authSession?.access_token) {
      console.log('❌ fetchLinkedStudents: No authentication token available');
      throw new Error('No authentication token available');
    }

    console.log('🔍 fetchLinkedStudents: Making request to:', `${WEB_API_URL}/api/parent/linked-students`);
    const response = await fetch(`${WEB_API_URL}/api/parent/linked-students`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authSession.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('🔍 fetchLinkedStudents: Response status:', response.status);
    if (!response.ok) {
      const errorData = await response.json();
      console.log('❌ fetchLinkedStudents: Error response:', errorData);
      throw new Error(errorData.error || 'Failed to fetch linked students');
    }

    const data = await response.json();
    console.log('✅ fetchLinkedStudents: Success, received:', data);
    return data.students || [];
  } catch (error) {
    console.error('💥 fetchLinkedStudents: Error:', error);
    throw error;
  }
};

// Search for students using automatic matching
export const searchStudents = async (parentName: string, parentEmail: string, parentPhone?: string): Promise<StudentMatch[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('No authentication token available');
    }

    const response = await fetch(`${WEB_API_URL}/api/parent/search-students`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        searchType: 'automatic',
        parentName,
        parentEmail,
        parentPhone,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to search students');
    }

    const data = await response.json();
    return data.matches || [];
  } catch (error) {
    console.error('Error searching students:', error);
    throw error;
  }
};

// Link a student to the current parent
export const linkStudent = async (studentId: string): Promise<boolean> => {
  try {
    console.log('🔍 linkStudent: Starting API call for studentId:', studentId);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      console.log('❌ linkStudent: No authentication token available');
      throw new Error('No authentication token available');
    }

    console.log('🔍 linkStudent: Making request to:', `${WEB_API_URL}/api/parent/link-student`);
    const response = await fetch(`${WEB_API_URL}/api/parent/link-student`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent_id: 'dummy', // Required by API but will be replaced with actual parent ID
        student_id: studentId,
        relationship: 'parent',
        is_primary: true,
      }),
    });

    console.log('🔍 linkStudent: Response status:', response.status);
    if (!response.ok) {
      const errorData = await response.json();
      console.log('❌ linkStudent: Error response:', errorData);
      throw new Error(errorData.error || 'Failed to link student');
    }

    const data = await response.json();
    console.log('✅ linkStudent: Success, received:', data);
    return true;
  } catch (error) {
    console.error('💥 linkStudent: Error:', error);
    throw error;
  }
};

// Legacy functions for backward compatibility
export const fetchStudents = async (parentId: string): Promise<Student[]> => {
  return fetchLinkedStudents();
};

export const fetchStudentById = async (studentId: string): Promise<Student | null> => {
  // Implementation to fetch a specific student by ID
  // This would typically make an API call to get student details
  return null;
};

export const updateStudent = async (studentId: string, updates: Partial<Student>): Promise<Student | null> => {
  // Implementation to update student information
  // This would typically make an API call to update student data
  return null;
};
