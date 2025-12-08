// Store configuration with Redux Persist
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authReducer from "./authSlice";
import studentReducer from "./studentSlice";
import paymentReducer from "./paymentSlice";

// Root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  student: studentReducer,
  payment: paymentReducer,
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["payment"], // Only persist payment cache
  blacklist: ["auth", "student"], // Don't persist auth (Supabase handles it) or student state (will be refetched)
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store configuration
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: __DEV__, // Enable Redux DevTools in development
});

// Persistor for the store
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Define the student state type for better type safety
export interface StudentState {
  linkedStudents: any[];
  searchResults: any[];
  loadingStudents: boolean;
  loadingSearch: boolean;
  linkingStudent: boolean;
  error: string | null;
}