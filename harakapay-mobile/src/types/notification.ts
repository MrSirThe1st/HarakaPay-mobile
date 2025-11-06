// Notification types
export interface Notification {
  id: string;
  user_id: string;
  school_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  read_at: string | null;
  action_url: string | null;
  notification_channel: string;
  metadata: NotificationMetadata | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationMetadata {
  student?: {
    id: string;
    first_name: string;
    last_name: string;
    name: string;
    level: string;
    grade_level: string;
  };
  parent?: {
    id: string;
    name: string;
  };
  masterNotificationId?: string;
  isScheduled?: boolean;
  [key: string]: any;
}

export interface NotificationResponse {
  success: boolean;
  notifications: Notification[];
  unreadCount: number;
  hasMore: boolean;
}
