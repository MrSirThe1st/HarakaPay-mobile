import Constants from 'expo-constants';
import { supabase } from '../config/supabase';

const API_URL = Constants.expoConfig?.extra?.WEB_API_URL || 'https://harakapay.com';

// Auth API service
export const login = async (credentials: any) => {
  // ...implementation...
};

export const deleteAccount = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(
      `${API_URL}/api/parent/delete-account`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete account: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
};
