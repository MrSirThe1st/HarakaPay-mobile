# Mobile App Auth Fix - Test Guide

## Problem Fixed
The mobile app was getting "Failed to fetch profile data" error during signup because:

1. **Wrong Table**: The app was querying `profiles` table instead of `parents` table
2. **Wrong Fields**: The app was looking for `role` field that doesn't exist in `parents` table
3. **Schema Mismatch**: The mobile app's database schema uses `parents` table, not `profiles`

## Changes Made

### 1. Fixed `fetchProfile` function in `authSlice.ts`
- Changed from `profiles` table to `parents` table
- Removed the `role` filter that doesn't exist
- Added better error logging

### 2. Fixed `signUp` function in `authSlice.ts`
- Changed profile creation from `profiles` table to `parents` table
- Updated field mapping to match `parents` table schema
- Added `email` field from user data

### 3. Updated `UserProfile` type in `auth.ts`
- Aligned with `parents` table schema
- Removed web-specific fields like `role`, `admin_type`, `school_id`, `permissions`, `is_active`
- Added mobile-specific fields like `address`, `national_id`, `notification_preferences`, `payment_preferences`

## Testing Steps

1. **Clear app data** (if testing on device/simulator)
2. **Try to sign up** with a new account
3. **Check console logs** for any remaining errors
4. **Verify** that the signup completes successfully
5. **Check** that the user can access the app after signup

## Expected Result
- Signup should complete without "Failed to fetch profile data" error
- User should be able to log in and access the app
- Profile data should be properly stored in the `parents` table

