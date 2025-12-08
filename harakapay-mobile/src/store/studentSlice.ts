// Student slice for Redux
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchLinkedStudents, searchStudents, linkStudent, LinkedStudent, StudentMatch } from '../api/studentApi';

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
  async (_, { rejectWithValue }) => {
    try {
      console.log('🚀 fetchLinkedStudentsAsync: Starting thunk');

      // Don't use session from Redux - let the API function fetch it from Supabase
      // This avoids issues with Redux Persist not properly serializing the Session object
      console.log('🔍 fetchLinkedStudentsAsync: Fetching session from Supabase directly');
      const students = await fetchLinkedStudents();
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
