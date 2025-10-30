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
  whitelist: ["auth", "payment"], // Persist auth and payment cache
  blacklist: ["student"], // Don't persist student state (will be refetched)
  debug: true, // Enable debug logging
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
export const persistor = persistStore(store, null, () => {
  console.log("✅ Redux Persist rehydration completed");
});

// Track rehydration state
let isRehydrating = true;
store.subscribe(() => {
  const state = store.getState();
  if (state._persist?.rehydrated && isRehydrating) {
    isRehydrating = false;
    console.log("🔄 Redux Persist rehydration finished, auth state:", {
      user: !!state.auth.user,
      session: !!state.auth.session,
      initialized: state.auth.initialized,
    });
  }
});

// Log store state changes in development
if (__DEV__) {
  store.subscribe(() => {
    const state = store.getState();
    console.log("🔄 Store state changed:", {
      auth: {
        user: !!state.auth.user,
        session: !!state.auth.session,
        initialized: state.auth.initialized,
        loading: state.auth.loading,
      },
      student: {
        linkedStudents: state.student.linkedStudents.length,
        loadingStudents: state.student.loadingStudents,
        loadingSearch: state.student.loadingSearch,
      },
    });
  });
}

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