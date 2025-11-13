// Notification API service
import { supabase } from '../config/supabase';
import { Notification, NotificationResponse } from '../types/notification';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://harakapayment.com';

/**
 * Fetch notifications for the authenticated user
 */
export const fetchNotifications = async (
  limit: number = 20,
  offset: number = 0,
  unreadOnly: boolean = false
): Promise<NotificationResponse> => {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }

  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
    unreadOnly: unreadOnly.toString(),
  });

  const url = `${API_URL}/api/notifications/user?${params}`;
  console.log('Fetching notifications from:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('API Error Response:', text);
    try {
      const error = JSON.parse(text);
      throw new Error(error.error || 'Failed to fetch notifications');
    } catch {
      throw new Error(`Failed to fetch notifications: ${response.status} ${text.substring(0, 100)}`);
    }
  }

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('Invalid JSON response:', text);
    throw new Error('Server returned invalid response');
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }

  const url = `${API_URL}/api/notifications/${notificationId}/read`;
  console.log('Marking notification as read:', url);

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('Mark as read error response:', text);
    try {
      const error = JSON.parse(text);
      throw new Error(error.error || 'Failed to mark notification as read');
    } catch {
      throw new Error(`Failed to mark notification as read: ${response.status} ${text.substring(0, 100)}`);
    }
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (notificationId: string): Promise<void> => {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_URL}/api/notifications/${notificationId}/read`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete notification');
  }
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async (): Promise<void> => {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_URL}/api/notifications/mark-all-read`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to mark all notifications as read');
  }
};
