import type { Session } from "@supabase/supabase-js";

/**
 * Token validation utilities for session management
 */

const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000; // 5 minutes buffer before actual expiry

/**
 * Check if a token has expired
 * @param expiresAt - Unix timestamp in seconds when the token expires
 * @returns true if token is expired or will expire within the buffer period
 */
export function isTokenExpired(expiresAt: number): boolean {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  const expiresAtWithBuffer = expiresAt - Math.floor(TOKEN_EXPIRY_BUFFER_MS / 1000);
  return now >= expiresAtWithBuffer;
}

/**
 * Check if a session is valid (not expired)
 * @param session - Supabase session object
 * @returns true if session exists and is not expired
 */
export function isSessionValid(session: Session | null): boolean {
  if (!session) {
    return false;
  }

  // Check if session has expires_at field
  if (!session.expires_at) {
    console.warn("⚠️ Session missing expires_at field, assuming valid for now");
    // Don't reject sessions without expires_at - they might be newly created
    // The Supabase client will handle their lifecycle
    return true;
  }

  const expired = isTokenExpired(session.expires_at);

  if (expired) {
    const expiresAtDate = new Date(session.expires_at * 1000);
    console.log(
      `⚠️ Session expired at ${expiresAtDate.toISOString()}`
    );
  }

  return !expired;
}

/**
 * Get time remaining until token expiry
 * @param expiresAt - Unix timestamp in seconds when the token expires
 * @returns Time remaining in milliseconds, or 0 if expired
 */
export function getTimeUntilExpiry(expiresAt: number): number {
  const now = Math.floor(Date.now() / 1000);
  const remainingSeconds = expiresAt - now;
  return Math.max(0, remainingSeconds * 1000);
}

/**
 * Check if a session needs to be refreshed (within buffer period)
 * @param session - Supabase session object
 * @returns true if session should be refreshed soon
 */
export function shouldRefreshSession(session: Session | null): boolean {
  if (!session?.expires_at) {
    return false;
  }

  const timeUntilExpiry = getTimeUntilExpiry(session.expires_at);
  return timeUntilExpiry <= TOKEN_EXPIRY_BUFFER_MS && timeUntilExpiry > 0;
}

/**
 * Format expiry time for logging
 * @param expiresAt - Unix timestamp in seconds
 * @returns Formatted string with expiry date and time remaining
 */
export function formatExpiryInfo(expiresAt: number): string {
  const expiryDate = new Date(expiresAt * 1000);
  const timeRemaining = getTimeUntilExpiry(expiresAt);
  const minutesRemaining = Math.floor(timeRemaining / 60000);

  return `Expires at ${expiryDate.toLocaleString()} (${minutesRemaining} minutes remaining)`;
}
