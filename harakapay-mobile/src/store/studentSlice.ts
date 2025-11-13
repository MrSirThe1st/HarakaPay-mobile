// Student slice for Redux
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchLinkedStudents, searchStudents, linkStudent, LinkedStudent, StudentMatch } from '../api/studentApi';
import { isSessionValid } from '../utils/tokenValidation';
import { supabase } from '../config/supabase';

interface StudentState {
  linkedStudents: LinkedStudent[];
  searchResults: StudentMatch[];
  loadingStudents: boolean;
  loadingSearch: boolean;
  linkingStudent: boolean;
  error: string | null;
}

const initialState: StudentState = {
  linkedStudents: [],
  searchResults: [],
  loadingStudents: false,
  loadingSearch: false,
  linkingStudent: false,
  error: null,
};

// Async thunks
export const fetchLinkedStudentsAsync = createAsyncThunk(
  'student/fetchLinkedStudents',
  async (_, { rejectWithValue, getState }) => {
    try {
      console.log('🚀 fetchLinkedStudentsAsync: Starting thunk');

      // Get session from Redux state
      const state = getState() as any;
      let session = state.auth.session;

      if (!session?.access_token) {
        console.log('❌ fetchLinkedStudentsAsync: No session in Redux state');
        return rejectWithValue('No authentication token available');
      }

      // Validate session is not expired
      if (!isSessionValid(session)) {
        console.warn('⚠️ fetchLinkedStudentsAsync: Session expired, attempting refresh...');

        try {
          const { data, error } = await supabase.auth.refreshSession();

          if (error || !data.session) {
            console.error('❌ fetchLinkedStudentsAsync: Session refresh failed:', error);
            return rejectWithValue('Session expired. Please log in again.');
          }

          console.log('✅ fetchLinkedStudentsAsync: Session refreshed successfully');
          session = data.session;
        } catch (refreshError) {
          console.error('💥 fetchLinkedStudentsAsync: Refresh exception:', refreshError);
          return rejectWithValue('Session expired. Please log in again.');
        }
      }

      console.log('✅ fetchLinkedStudentsAsync: Using valid session from Redux');
      const students = await fetchLinkedStudents(session);
      console.log('✅ fetchLinkedStudentsAsync: Success, students:', students.length);
      return students;
    } catch (error) {
      console.log('❌ fetchLinkedStudentsAsync: Error:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch students');
    }
  }
);

export const searchStudentsAsync = createAsyncThunk(
  'student/searchStudents',
  async ({ parentName, parentEmail, parentPhone }: { parentName: string; parentEmail: string; parentPhone?: string }, { rejectWithValue }) => {
    try {
      const matches = await searchStudents(parentName, parentEmail, parentPhone);
      return matches;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to search students');
    }
  }
);

export const linkStudentAsync = createAsyncThunk(
  'student/linkStudent',
  async (studentId: string, { rejectWithValue }) => {
    try {
      await linkStudent(studentId);
      return studentId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to link student');
    }
  }
);

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    addLinkedStudent: (state, action: PayloadAction<LinkedStudent>) => {
      state.linkedStudents.push(action.payload);
    },
    removeLinkedStudent: (state, action: PayloadAction<string>) => {
      state.linkedStudents = state.linkedStudents.filter(student => student.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // Fetch linked students
    builder
      .addCase(fetchLinkedStudentsAsync.pending, (state) => {
        console.log('🔄 fetchLinkedStudentsAsync.pending');
        state.loadingStudents = true;
        state.error = null;
      })
      .addCase(fetchLinkedStudentsAsync.fulfilled, (state, action) => {
        console.log('✅ fetchLinkedStudentsAsync.fulfilled, students:', action.payload.length);
        state.loadingStudents = false;
        state.linkedStudents = action.payload;
      })
      .addCase(fetchLinkedStudentsAsync.rejected, (state, action) => {
        console.log('❌ fetchLinkedStudentsAsync.rejected, error:', action.payload);
        state.loadingStudents = false;
        state.error = action.payload as string;
      });

    // Search students
    builder
      .addCase(searchStudentsAsync.pending, (state) => {
        state.loadingSearch = true;
        state.error = null;
      })
      .addCase(searchStudentsAsync.fulfilled, (state, action) => {
        state.loadingSearch = false;
        state.searchResults = action.payload;
      })
      .addCase(searchStudentsAsync.rejected, (state, action) => {
        state.loadingSearch = false;
        state.error = action.payload as string;
      });

    // Link student
    builder
      .addCase(linkStudentAsync.pending, (state) => {
        state.linkingStudent = true;
        state.error = null;
      })
      .addCase(linkStudentAsync.fulfilled, (state, action) => {
        state.linkingStudent = false;
        // Remove from search results and add to linked students
        const linkedStudent = state.searchResults.find(student => student.id === action.payload);
        if (linkedStudent) {
          state.linkedStudents.push(linkedStudent);
          state.searchResults = state.searchResults.filter(student => student.id !== action.payload);
        }
      })
      .addCase(linkStudentAsync.rejected, (state, action) => {
        state.linkingStudent = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSearchResults, addLinkedStudent, removeLinkedStudent } = studentSlice.actions;
export default studentSlice.reducer;
