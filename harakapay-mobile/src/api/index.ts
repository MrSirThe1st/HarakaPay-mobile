export * from "./authApi";
export * from "./paymentApi";
export * from "./studentApi";
export * from "./notificationApi";

// Base API configuration
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://harakapayment.com";

// Common API headers
export const getApiHeaders = () => {
  const { AuthService } = require("../services/authService");
  return {
    "Content-Type": "application/json",
    ...AuthService.getAuthHeaders(),
  };
};
