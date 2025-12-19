import React, { createContext, useContext, useState, ReactNode } from 'react';
import { fetchLinkedStudents, searchStudents, linkStudent, LinkedStudent, StudentMatch } from '../api/studentApi';

interface StudentContextType {
  linkedStudents: LinkedStudent[];
  searchResults: StudentMatch[];
  loadingStudents: boolean;
  loadingSearch: boolean;
  linkingStudent: boolean;
  error: string | null;
  fetchLinkedStudentsAsync: () => Promise<void>;
  searchStudentsAsync: (parentName: string, parentEmail: string, parentPhone?: string) => Promise<void>;
  linkStudentAsync: (studentId: string) => Promise<void>;
  clearError: () => void;
  clearSearchResults: () => void;
  addLinkedStudent: (student: LinkedStudent) => void;
  removeLinkedStudent: (studentId: string) => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [linkedStudents, setLinkedStudents] = useState<LinkedStudent[]>([]);
  const [searchResults, setSearchResults] = useState<StudentMatch[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [linkingStudent, setLinkingStudent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLinkedStudentsAsync = async () => {
    try {
      console.log('🚀 fetchLinkedStudentsAsync: Starting');
      setLoadingStudents(true);
      setError(null);

      const students = await fetchLinkedStudents();
      console.log('✅ fetchLinkedStudentsAsync: Success, students:', students.length);
      setLinkedStudents(students);
    } catch (err) {
      console.log('❌ fetchLinkedStudentsAsync: Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch students';
      setError(errorMessage);
      throw err;
    } finally {
      setLoadingStudents(false);
    }
  };

  const searchStudentsAsync = async (parentName: string, parentEmail: string, parentPhone?: string) => {
    try {
      setLoadingSearch(true);
      setError(null);

      const matches = await searchStudents(parentName, parentEmail, parentPhone);
      setSearchResults(matches);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search students';
      setError(errorMessage);
      throw err;
    } finally {
      setLoadingSearch(false);
    }
  };

  const linkStudentAsync = async (studentId: string) => {
    try {
      setLinkingStudent(true);
      setError(null);

      await linkStudent(studentId);

      // Move student from search results to linked students
      const linkedStudent = searchResults.find(s => s.id === studentId);
      if (linkedStudent) {
        setLinkedStudents(prev => [...prev, linkedStudent]);
        setSearchResults(prev => prev.filter(s => s.id !== studentId));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to link student';
      setError(errorMessage);
      throw err;
    } finally {
      setLinkingStudent(false);
    }
  };

  const clearError = () => setError(null);
  const clearSearchResults = () => setSearchResults([]);
  const addLinkedStudent = (student: LinkedStudent) => {
    setLinkedStudents(prev => [...prev, student]);
  };
  const removeLinkedStudent = (studentId: string) => {
    setLinkedStudents(prev => prev.filter(s => s.id !== studentId));
  };

  const value: StudentContextType = {
    linkedStudents,
    searchResults,
    loadingStudents,
    loadingSearch,
    linkingStudent,
    error,
    fetchLinkedStudentsAsync,
    searchStudentsAsync,
    linkStudentAsync,
    clearError,
    clearSearchResults,
    addLinkedStudent,
    removeLinkedStudent,
  };

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
};

export const useStudents = () => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
};
