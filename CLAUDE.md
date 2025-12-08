# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HarakaPay is a digital platform for school fee payment and communication in Congo. This is the **Parent Mobile App** (React Native/Expo), which is part of a larger ecosystem including:
- **School Web Portal** (React/Next.js) - School administration interface
- **Admin Dashboard** (React) - Platform-wide management
- **Backend** - Supabase (PostgreSQL) + Node.js microservices

The mobile app allows parents to:
- Manage multiple children across different schools
- View fee balances and payment history
- Make payments via M-Pesa, Airtel Money, Orange Money, bank transfers
- Receive real-time notifications from schools
- Download invoices and receipts

## Development Commands

### Primary Development
```bash
# Main project (root)
npm start                    # Start Expo dev server
npm run android             # Run on Android emulator/device
npm run ios                 # Run on iOS simulator/device
npm run web                 # Run web version

# Actual app (harakapay-mobile subdirectory)
cd harakapay-mobile
npm start                   # Start Expo dev server
npm run android            # Run on Android
npm run ios                # Run on iOS
npm run web                # Run web version
```

### Code Quality
```bash
# TypeScript
npx tsc --noEmit           # Type check without emitting files

# Linting (if needed)
npm run lint               # Run ESLint (if configured)
```

### Important Notes
- **Project structure**: The actual Expo app is in the `harakapay-mobile/` subdirectory
- **Entry point**: `harakapay-mobile/index.ts`
- **Source code**: All app code is in `harakapay-mobile/src/`
- **React Native new architecture**: Enabled (`newArchEnabled: true` in app.json)

## Architecture

### State Management (Redux Toolkit + Redux Persist)

The app uses Redux Toolkit with AsyncStorage persistence. Configuration is in `harakapay-mobile/src/store/index.ts`.

**Persisted Slices:** `auth`, `payment`
**Not Persisted:** `student` (refetched each session)

**Redux Slices:**

1. **authSlice** ([src/store/authSlice.ts](harakapay-mobile/src/store/authSlice.ts))
   - State: `user`, `profile`, `session`, `loading`, `error`, `success`, `initialized`
   - Key thunks: `signIn`, `signUp`, `signOut`, `fetchProfile`, `refreshSession`, `forgotPassword`, `updatePassword`
   - Authentication is handled via Supabase with JWT tokens

2. **studentSlice** ([src/store/studentSlice.ts](harakapay-mobile/src/store/studentSlice.ts))
   - State: `linkedStudents`, `searchResults`, `loadingStudents`, `loadingSearch`, `linkingStudent`, `error`
   - Key thunks: `fetchLinkedStudentsAsync`, `searchStudentsAsync`, `linkStudentAsync`
   - Handles parent-student linking workflow

3. **paymentSlice** ([src/store/paymentSlice.ts](harakapay-mobile/src/store/paymentSlice.ts))
   - State: `studentFees` (cached per student), `loading`, `error`
   - Implements 5-minute cache for fee data
   - Key thunk: `fetchStudentFeeData` (with caching)

4. **storeSlice** ([src/store/storeSlice.ts](harakapay-mobile/src/store/storeSlice.ts))
   - Optional commerce feature for school stores
   - State: `categories`, `items`, `orders`, `stockRequests`, `hireRecords`, `cart`
   - Full shopping cart management

5. **notificationSlice** ([src/store/notificationSlice.ts](harakapay-mobile/src/store/notificationSlice.ts))
   - Currently minimal implementation
   - See NOTIFICATIONS_IMPLEMENTATION.md for future enhancements

### API Layer Architecture

APIs are organized by domain in `harakapay-mobile/src/api/`. Each API module exports typed functions that make HTTP requests.

**Base Configuration** ([src/api/index.ts](harakapay-mobile/src/api/index.ts)):
- `API_BASE_URL`: From `WEB_API_URL` in app.json extra config
- `getApiHeaders()`: Fetches auth token from AuthService

**API Modules:**

- **authApi.ts** - Login/authentication (minimal/stub)
- **studentApi.ts** - Student search and linking
  - `fetchLinkedStudents()` → GET `/api/parent/linked-students`
  - `searchStudents()` → POST `/api/parent/search-students`
  - `linkStudent()` → POST `/api/parent/link-student`
- **paymentApi.ts** - Fee and payment schedule details
  - `fetchStudentFeeCategories()` → GET `/api/parent/student-fees-detailed`
  - `fetchStudentPaymentSchedules()` → GET `/api/parent/student-fees-detailed`
  - Auto-refreshes session on 401
- **notificationApi.ts** - Notification management
  - `fetchNotifications()`, `markNotificationAsRead()`, `deleteNotification()`, `markAllNotificationsAsRead()`
- **storeApi.ts** - School store commerce (optional feature)
  - Generic `apiCall<T>()` for all store endpoints
  - Sub-APIs: categories, items, orders, stock requests, hire records

**API Pattern:**
- All APIs use Bearer token authentication
- Session refresh on 401 errors
- TypeScript for all request/response types
- Error handling with typed responses

### Services Layer

Services in `harakapay-mobile/src/services/` wrap APIs with business logic:

- **authService.ts** - Static class for auth state access
  - `getToken()`, `getUser()`, `getParent()`, `isAuthenticated()`, `logout()`
  - `getAuthHeaders()` - Returns Bearer token headers
  - `registerParent()`, `hasCompleteProfile()`
- **studentService.ts** - Student operations
  - `getStudents()`, `lookupStudentByNumber()`, `linkStudentsBatch()`
  - Batch linking has retry logic and waits for parent record creation
- **paymentService.ts** - Payment processing (placeholder)
- **parentProfileService.ts** - Parent profile creation
  - `createParentProfile()` with duplicate request prevention
- **notificationService.ts** - Notifications (placeholder)

### Authentication Flow

**Technology:** Supabase Auth + JWT

1. **Sign-Up:**
   - User provides: email, password, firstName, lastName, phone
   - Supabase creates auth user with metadata
   - Parent profile created via POST `/api/parent/create-profile`
   - Profile stored in `profiles` table with role='parent'
   - Redux state updated with user + profile

2. **Sign-In:**
   - Supabase authenticates with email/password
   - Returns session (with access_token) + user
   - Profile fetched from Supabase
   - Session persisted in Redux

3. **Session Management:**
   - Access token stored in Redux (persisted to AsyncStorage)
   - Token sent as `Authorization: Bearer {token}` in all API requests
   - Auto-refresh on 401 errors
   - `AuthService.getToken()` retrieves token from Redux state

4. **Password Reset:**
   - `forgotPassword(email)` triggers Supabase reset email
   - Deep link: `harakapay://reset-password`
   - `updatePassword(newPassword)` completes the reset

**Supabase Configuration:** [src/config/supabase.ts](harakapay-mobile/src/config/supabase.ts)
- Full database type definitions included
- Client initialized with SUPABASE_URL and SUPABASE_ANON_KEY from app.json

### Navigation Structure

**Navigation files:** `harakapay-mobile/src/navigation/`

**MainNavigator.tsx** (Stack Navigator):
- Root: `Tabs` (bottom tab navigator)
- Auth screens: `Login`, `Register`, `ForgotPassword`, `ResetPassword`
- Main screens: `Profile`, `Settings`, `ConnectChild`, `LinkStudent`, `ChildDetails`
- Fee/Payment screens: `FeeDetails`, `PaymentPlans`, `PaymentPlanDetails`, `Payments`, `PaymentSchedule`, `PaymentStatus`, `PaymentHistory`

**TabNavigator.tsx** (Bottom Tabs):
- `Home` → DashboardScreen
- `Notifications` → NotificationsScreen
- `Profile` → ProfileScreen

**AuthNavigator.tsx** (Auth Stack):
- `Login` (initial route)
- `Register`, `ForgotPassword`, `ResetPassword`

**Screen Organization:**
- Auth screens: [src/screens/auth/](harakapay-mobile/src/screens/auth/)
- Parent screens: [src/screens/parent/](harakapay-mobile/src/screens/parent/)

### Type System

**Type definitions:** `harakapay-mobile/src/types/`

- **auth.ts** - `User`, `UserRole`, `UserProfile`
- **student.ts** - `Student`, `StudentLookupResult`, `StudentToLink`, `BatchLinkResult`
- **payment.ts** - `Payment`
- **notification.ts** - `Notification`, `NotificationMetadata`, `NotificationResponse`
- **store.ts** - Commerce types (categories, items, orders, cart)
- **supabase.ts** - Full database schema types (profiles, parents, students, schools, payments)

### Student Linking Workflow

The student linking system allows parents to connect their children to their account:

1. **Search Phase:**
   - Parent provides: name, email, phone (optional)
   - API searches for matching students in database
   - Returns: `StudentMatch[]` with student details

2. **Linking Phase:**
   - Parent selects students to link
   - Batch linking via `linkStudentsBatch()` in studentService
   - Service waits for parent record creation (up to 3 seconds)
   - Retry logic handles transient failures
   - Returns: success/error summary

3. **State Management:**
   - Linked students stored in Redux `studentSlice`
   - NOT persisted (refetched each session for data freshness)

### Payment Caching Strategy

The payment slice implements intelligent caching:

- **Cache Duration:** 5 minutes per student
- **Cache Keys:** By student ID
- **Invalidation:** Manual via `invalidateStudentCache(studentId)` or `invalidateAllCache()`
- **Purpose:** Reduce API calls for frequently accessed fee data

## Environment Configuration

### Mobile App Environment Variables

**Location:** `app.json` → `extra` section (and `.env` file)

```json
{
  "extra": {
    "SUPABASE_URL": "https://apdeuckmufukrnuffetv.supabase.co",
    "SUPABASE_ANON_KEY": "...",
    "SUPABASE_SERVICE_ROLE_KEY": "...",
    "WEB_API_URL": "https://harakapayment.com"
  }
}
```

**Access in code:**
```typescript
import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig?.extra?.WEB_API_URL;
```

### Deep Linking Configuration

**Scheme:** `harakapay://`

**Configured intents:**
- `harakapay://reset-password` - Password reset flow
- Android auto-verify enabled for production

## Key Dependencies

### Core
- **expo** ~53.0.20 - Expo framework
- **react-native** 0.79.5
- **react** 19.0.0

### State Management
- **@reduxjs/toolkit** ^2.8.2 - Redux state management
- **react-redux** ^9.2.0
- **redux-persist** ^6.0.0 - State persistence

### Backend/API
- **@supabase/supabase-js** ^2.55.0 - Supabase client
- **@react-native-async-storage/async-storage** ^2.2.0 - Local storage

### Navigation
- **@react-navigation/native** ^7.1.17
- **@react-navigation/stack** ^7.4.7
- **@react-navigation/bottom-tabs** ^7.4.6
- **react-native-gesture-handler** ^2.28.0
- **react-native-safe-area-context** ^5.6.1
- **react-native-screens** ^4.14.1

### Utilities
- **date-fns** ^4.1.0 - Date formatting
- **expo-linear-gradient** ^15.0.7 - Gradient components

## Common Development Patterns

### Adding a New Redux Slice

1. Create slice file in [src/store/](harakapay-mobile/src/store/)
2. Define state interface and initial state
3. Create async thunks for API calls
4. Add reducers for synchronous state changes
5. Export slice actions and reducer
6. Add to store configuration in [src/store/index.ts](harakapay-mobile/src/store/index.ts)
7. Optionally add to persist config if state should survive app restarts

### Adding a New API Endpoint

1. Add API function to appropriate file in [src/api/](harakapay-mobile/src/api/)
2. Use `getApiHeaders()` for authentication
3. Add TypeScript types for request/response
4. Handle errors appropriately
5. Consider session refresh on 401
6. Optionally wrap in service layer for business logic

### Adding a New Screen

1. Create screen component in [src/screens/](harakapay-mobile/src/screens/)
2. Add to appropriate navigator ([src/navigation/](harakapay-mobile/src/navigation/))
3. Add TypeScript navigation types
4. Connect to Redux if needed
5. Follow existing screen patterns for consistency

### Working with Authentication

Always use `AuthService` to access auth state:

```typescript
import AuthService from '@/services/authService';

const token = AuthService.getToken();
const user = AuthService.getUser();
const isAuth = AuthService.isAuthenticated();
```

Never access Redux auth state directly from components.

## Integration with Backend

This mobile app integrates with:

1. **Supabase** - Authentication, database, real-time subscriptions
   - Direct Supabase client usage for auth operations
   - RLS (Row Level Security) enforced on all tables

2. **Web API** (Node.js/Next.js) - Business logic, payment processing
   - Base URL: `WEB_API_URL` from config
   - All endpoints require Bearer token authentication
   - RESTful API design

3. **Payment Microservices** - Payment gateway integrations (M-Pesa, Airtel Money, Orange Money)
   - Configured in `.env` (see MPESA_* variables)
   - Sandbox environment for development

## Notifications Implementation

The notification system is fully implemented. See [NOTIFICATIONS_IMPLEMENTATION.md](NOTIFICATIONS_IMPLEMENTATION.md) for complete details.

**Key features:**
- List view with pagination
- Pull to refresh
- Infinite scroll
- Filter by read/unread
- Mark as read/delete
- Real-time updates

**API endpoints:**
- `GET /api/notifications/user` - Fetch notifications
- `PUT /api/notifications/{id}/read` - Mark as read
- `DELETE /api/notifications/{id}/read` - Delete notification
- `POST /api/notifications/mark-all-read` - Mark all as read

## Code Organization Principles

1. **Layered Architecture:**
   - Components → Services → API → Backend
   - Redux for global state management
   - Services layer abstracts business logic from API calls

2. **Type Safety:**
   - All API requests/responses are typed
   - Strict TypeScript mode enabled
   - Types defined separately in `src/types/`

3. **State Management:**
   - Redux for global state
   - Local component state for UI-only state
   - Redux Persist for data that survives app restarts

4. **Error Handling:**
   - Try-catch blocks in all async operations
   - User-friendly error messages
   - Automatic session refresh on auth errors

## Special Considerations

### Parent Record Creation
When a new parent signs up, there's a delay before their parent record appears in the database. The `linkStudentsBatch()` function in studentService handles this by waiting up to 3 seconds for the record to be created.

### Multi-School Support
The app is designed to support parents with children in multiple schools. All student-related data is school-scoped.

### Payment Methods
The app supports multiple payment methods for Congo:
- M-Pesa (Vodacom)
- Airtel Money
- Orange Money
- Bank transfers

Configuration is in `.env` file (MPESA_* variables).

### Real-Time Updates
Supabase provides real-time subscription capabilities. Consider using for:
- Payment status updates
- New notifications
- Fee balance changes

## Testing

### Local Development Testing

1. **Start backend:** Ensure web API is running (check `WEB_API_URL`)
2. **Run mobile app:**
   ```bash
   cd harakapay-mobile
   npm start
   ```
3. **Test on device:**
   - iOS: `npm run ios` (requires Xcode)
   - Android: `npm run android` (requires Android Studio)
   - Web: `npm run web`

### API Testing Notes

- **iOS Simulator:** Use `http://localhost:3001` for local API
- **Android Emulator:** Use `http://10.0.2.2:3001` for local API
- **Physical Device:** Use your computer's IP (e.g., `http://192.168.1.x:3001`)

Update `WEB_API_URL` in app.json accordingly.

## Troubleshooting

### Common Issues

1. **"Not authenticated" errors:**
   - Check if user is logged in
   - Verify session is valid and not expired
   - Check token is being sent in headers

2. **API connection errors:**
   - Verify `WEB_API_URL` is correct for your testing environment
   - Ensure backend server is running
   - Check network connectivity

3. **Student linking failures:**
   - Ensure parent profile was created successfully
   - Check if parent record exists in database
   - Review logs for specific error messages

4. **Redux persist issues:**
   - Clear AsyncStorage: Delete app and reinstall
   - Check Redux DevTools for state inspection

### Debugging Tools

- **React Native Debugger** - For inspecting Redux state and network requests
- **Flipper** - For debugging React Native apps
- **Expo DevTools** - For logs and development info
