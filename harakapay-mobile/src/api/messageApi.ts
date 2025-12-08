import Constants from 'expo-constants';
import { supabase } from '../config/supabase';
import type { ParentSchoolMessage, SendMessageRequest, MessageListResponse } from '../types/message';

const API_URL = Constants.expoConfig?.extra?.WEB_API_URL || 'https://harakapay.com';

export const fetchMessages = async (
  page = 1,
  limit = 20
): Promise<MessageListResponse> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error('No authentication token');
    }

    const url = `${API_URL}/api/messages/parent-to-school?page=${page}&limit=${limit}`;
    console.log('Fetching messages from:', url);
    console.log('Token (first 20 chars):', session.access_token.substring(0, 20) + '...');
    console.log('User ID:', session.user?.id);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Messages API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Messages API error:', response.status, errorText);
      throw new Error(`Failed to fetch messages: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const sendMessage = async (
  request: SendMessageRequest
): Promise<{ success: boolean; message: string; data?: ParentSchoolMessage }> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(
      `${API_URL}/api/messages/parent-to-school`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};