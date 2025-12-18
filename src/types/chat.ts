export interface User {
  id: number;
  name: string;
  avatar: string | null;
}

export interface Message {
  id: number;
  body: string;
  is_read: boolean;
  type: string;
  created_at: string;
  sender_id: number;
  sender?: User;
  file_url?: string | null;
}

export interface Conversation {
  id: number;
  is_private: boolean;
  other_user: User;
  last_message: Message | null;
  unread_count: number;
  is_favorite: boolean;
  is_archived: boolean;
  updated_at: string;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

export interface ConversationsResponse {
  data: Conversation[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface StartConversationResponse {
  data: Conversation;
}

export interface MessagesResponse {
  data: Message[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface SendMessageResponse {
  data: Message;
}
