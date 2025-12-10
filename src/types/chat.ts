export interface Message {
  id: number;
  sender: 'me' | 'other';
  text: string;
  time: string;
  isRead: boolean;
}

export interface Chat {
  id: number;
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
