// src/services/parentProfileService.ts
import { supabase } from '../config/supabase';
import { WEB_API_URL } from '../config/env';

export interface CreateParentProfileRequest {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

export interface CreateParentProfileResponse {
  success: boolean;
  profile?: {
    id: string;
    user_id: string;
    first_name: string;
    last_name: string;
    phone: string | null;
    role: string;
    is_active: boolean;
    created_at: string;
  };
  error?: string;
}

// Track ongoing profile creation requests to prevent duplicates
const ongoingRequests = new Map<string, Promise<CreateParentProfileResponse>>();

export const createParentProfile = async (
  profileData: CreateParentProfileRequest
): Promise<CreateParentProfileResponse> => {
  const userId = profileData.user_id;
  
  // Check if there's already an ongoing request for this user
  if (ongoingRequests.has(userId)) {
    console.log('🔄 Profile creation already in progress for user:', userId);
    return ongoingRequests.get(userId)!;
  }

  const requestPromise = (async () => {
    try {
      console.log('🔄 Creating parent profile for user:', userId);
    
    // Get the current session to ensure we're authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No active session found');
    }

    // Get API URL from environment configuration
    const API_URL = WEB_API_URL;
    
    console.log('🌐 API URL:', API_URL);
    console.log('🔗 Full endpoint:', `${API_URL}/api/parent/create-profile`);

    // Call the web API endpoint with timeout
    console.log('📤 Sending POST request to:', `${API_URL}/api/parent/create-profile`);
    console.log('📤 Request data:', profileData);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

    const response = await fetch(`${API_URL}/api/parent/create-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(profileData),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    
    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Profile creation failed:', result.error);
      return {
        success: false,
        error: result.error || 'Failed to create profile'
      };
    }

    console.log('✅ Parent profile created successfully:', result.profile.id);
    return {
      success: true,
      profile: result.profile
    };

  } catch (error) {
    console.error('💥 Profile creation exception:', error);
    console.error('💥 Error type:', typeof error);
    console.error('💥 Error constructor:', error?.constructor?.name);
    console.error('💥 Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code,
      errno: (error as any)?.errno,
      syscall: (error as any)?.syscall,
      stack: error instanceof Error ? error.stack : 'No stack trace',
      fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
    });

    const errorMessage = error instanceof Error && error.name === 'AbortError'
      ? 'Request timeout - please check your internet connection'
      : error instanceof Error ? error.message : 'Unknown error occurred';

    return {
      success: false,
      error: errorMessage
    };
  } finally {
    // Clean up the ongoing request
    ongoingRequests.delete(userId);
  }
  })();

  // Store the promise to prevent duplicate requests
  ongoingRequests.set(userId, requestPromise);
  
  return requestPromise;
};
