// Store configuration
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import studentReducer from './studentSlice';
import paymentReducer from './paymentSlice';
import notificationReducer from './notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    student: studentReducer,
    payment: paymentReducer,
    notification: notificationReducer,
  },
});
