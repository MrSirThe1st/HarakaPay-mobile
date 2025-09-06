// Student business logic
import { Student } from '../types/student';
import { fetchStudents, fetchStudentById, updateStudent } from '../api/studentApi';

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
