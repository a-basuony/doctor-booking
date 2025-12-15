export interface Message {
  id: number;
  sender: 'me' | 'other';
  text: string;
  time: string;
  isRead: boolean;
  image?: string; // Added for image rendering
}

export interface Chat {
  id: number;
  doctorId?: number; // Added for sender identification
  fullName: string;
  avatar: string;
  lastMessage: string;
  unreadCount: number;
  isFavorite: boolean;
  isUnread: boolean;
  timestamp: string;
  lastSeen: string;
  messages: Message[];
}
