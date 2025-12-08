export type MessageStatus = 'unread' | 'read';

export interface ParentSchoolMessage {
  id: string;
  parent_id: string;
  school_id: string;
  student_id: string;
  subject: string;
  message: string;
  status: MessageStatus;
  read_at: string | null;
  created_at: string;
  updated_at: string;
  parent?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
  };
  student?: {
    id: string;
    first_name: string;
    last_name: string;
    grade_level: string;
    student_id: string;
  };
}

export interface SendMessageRequest {
  student_id: string;
  subject: string;
  message: string;
}

export interface MessageListResponse {
  success: boolean;
  messages: ParentSchoolMessage[];
  unreadCount: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}