# Redux Auth Implementation

This document describes the Redux-based authentication system implemented in HarakaPay Mobile.

## Overview

The authentication system has been migrated from React state to Redux with persistence using `redux-persist`. This provides better state management, persistence across app restarts, and easier debugging.

## Architecture

### Store Structure

```
store/
├── index.ts          # Store configuration with Redux Persist
├── authSlice.ts      # Auth state and actions
└── __tests__/        # Test files
```

### Auth State

```typescript
interface AuthState {
  user: User | null; // Supabase user object
  parent: Parent | null; // Parent profile data
  session: Session | null; // Supabase session
  loading: boolean; // Loading state
  error: string | null; // Error message
  success: boolean; // Success state
  initialized: boolean; // Auth initialization status
}
```

## Key Features

### 1. Automatic Persistence

- Auth state is automatically persisted to AsyncStorage
- Survives app restarts and device reboots
- Session validation and refresh on app launch

### 2. Async Thunks

- `signIn`: Handle user login
- `signUp`: Handle user registration
- `signOut`: Handle user logout
- `forgotPassword`: Handle password reset
- `loadStoredAuth`: Load persisted auth data
- `refreshSession`: Refresh expired sessions
- `fetchParent`: Fetch parent profile data

### 3. Real-time Auth State

- Listens to Supabase auth state changes
- Automatically updates Redux state
- Handles token refresh and session management

## Usage

### In Components

```typescript
import { useAuth } from '../hooks/useAuth';

const MyComponent = () => {
  const {
    user,
    parent,
    session,
    loading,
    error,
    signIn,
    signOut
  } = useAuth();

  const handleLogin = async () => {
    const result = await signIn(email, password);
    if (result.success) {
      // Handle successful login
    } else {
      // Handle error
    }
  };

  return (
    // Your component JSX
  );
};
```

### In Services

```typescript
import { AuthService } from "../services/authService";

// Get auth token for API calls
const token = AuthService.getToken();

// Check if user is authenticated
if (AuthService.isAuthenticated()) {
  // Make authenticated API call
}

// Get user info
const user = AuthService.getUser();
const parent = AuthService.getParent();
```

### API Integration

```typescript
import { getApiHeaders } from "../api";

const makeApiCall = async () => {
  const response = await fetch("/api/endpoint", {
    headers: getApiHeaders(),
    // ... other options
  });
};
```

## Migration from React State

The `useAuth` hook maintains the same interface, so existing components don't need changes:

### Before (React State)

```typescript
const { signIn, loading, error, user } = useAuth();
```

### After (Redux)

```typescript
const { signIn, loading, error, user } = useAuth();
// Same interface, but now powered by Redux!
```

## Benefits

1. **Centralized State**: All auth state is managed in one place
2. **Persistence**: Auth state survives app restarts
3. **Debugging**: Redux DevTools support for better debugging
4. **Performance**: Optimized re-renders with Redux selectors
5. **Scalability**: Easy to add more auth-related features
6. **Testing**: Better testability with pure reducers

## Configuration

### Redux Persist

- **Storage**: AsyncStorage
- **Whitelist**: Only auth state is persisted
- **Blacklist**: Other reducers are not persisted

### Store Setup

```typescript
// App.tsx
<Provider store={store}>
  <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
    <App />
  </PersistGate>
</Provider>
```

## Error Handling

Errors are automatically handled and stored in the Redux state:

```typescript
const { error, clearError } = useAuth();

// Clear error when needed
useEffect(() => {
  if (error) {
    // Show error to user
    setTimeout(() => clearError(), 5000); // Auto-clear after 5s
  }
}, [error, clearError]);
```

## Loading States

Loading states are managed automatically for all async operations:

```typescript
const { loading } = useAuth();

if (loading) {
  return <LoadingSpinner />;
}
```

## Testing

The Redux setup includes test utilities:

```typescript
// Test auth slice
import authReducer from "../store/authSlice";

describe("Auth Slice", () => {
  it("should handle clearError", () => {
    // Test implementation
  });
});
```

## Troubleshooting

### Common Issues

1. **Auth not persisting**: Check if Redux Persist is properly configured
2. **Session not refreshing**: Verify Supabase configuration
3. **State not updating**: Check if component is wrapped in Provider

### Debug Tips

1. Use Redux DevTools to inspect state changes
2. Check console logs for auth events
3. Verify AsyncStorage has auth data
4. Check Supabase auth state listener

## Future Enhancements

- [ ] Add biometric authentication
- [ ] Implement offline auth support
- [ ] Add multi-tenant support
- [ ] Enhanced error handling with retry logic
- [ ] Auth analytics and monitoring
