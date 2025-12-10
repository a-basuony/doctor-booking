import type { Chat } from '../types/chat';

export const mockChats: Chat[] = [
  {
    id: 1,
    fullName: "Dr. Robert Lewis",
    avatar: "https://i.pravatar.cc/150?img=11",
    lastMessage: "It's been around six PM",
    unreadCount: 3,
    isFavorite: true,
    isUnread: true,
    timestamp: "5:30 PM",
    lastSeen: "Online",
    messages: [
      { id: 1, sender: "me", text: "Hi self it's been a while", time: "5:20 PM", isRead: true },
      { id: 2, sender: "other", text: "Hi doctor that right", time: "5:21 PM", isRead: true },
      { id: 3, sender: "other", text: "I was okay, but now I suffer form issues", time: "5:22 PM", isRead: true },
      { id: 4, sender: "me", text: "I feel bad", time: "5:25 PM", isRead: true },
      { id: 5, sender: "me", text: "What about you visit me", time: "5:30 PM", isRead: true },
      { id: 6, sender: "me", text: "It's been around six PM", time: "5:30 PM", isRead: true }
    ]
  },
  {
    id: 2,
    fullName: "Dr. Jana",
    avatar: "https://i.pravatar.cc/150?img=5",
    lastMessage: "you ok ? i will do it like...",
    unreadCount: 0,
    isFavorite: false,
    isUnread: false,
    timestamp: "1:23 PM",
    lastSeen: "Last seen today at 1:00 PM",
    messages: [
       { id: 1, sender: "other", text: "Hello there!", time: "1:00 PM", isRead: true }
    ]
  },
  {
    id: 3,
    fullName: "Dr. Jessica Turner",
    avatar: "https://i.pravatar.cc/150?img=9",
    lastMessage: "It's been around six...",
    unreadCount: 0,
    isFavorite: true,
    isUnread: false,
    timestamp: "Yesterday",
    lastSeen: "Last seen yesterday",
    messages: []
  },
  {
    id: 4,
    fullName: "Dr. Jessica",
    avatar: "https://i.pravatar.cc/150?img=10",
    lastMessage: "It's been around six...",
    unreadCount: 0,
    isFavorite: false,
    isUnread: false,
    timestamp: "2 days",
    lastSeen: "Last seen 2 days ago",
    messages: []
  }
];
