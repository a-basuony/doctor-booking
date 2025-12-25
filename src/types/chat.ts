export interface User {
  id: number;
  name: string;
  avatar: string | null;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  sender_name: string;
  sender_avatar: string | null;
  body: string;
  type: "text" | "image" | "audio" | "video";
  is_mine: boolean;
  created_at: string;
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

export interface Chat {
  id: number;
  fullName: string;
  avatar: string;
  messages: {
    id: number;
    sender: "me" | "other";
    text: string;
    time: string;
    isRead: boolean;
    image?: string | null;
    type?: "text" | "image" | "audio" | "video";
  }[];
  lastSeen?: string;
  isUnread?: boolean;
  isFavorite?: boolean;
  isArchived?: boolean;
  unreadCount: number;
}
