import type { Chat, Message } from "../types/chat";

export const mockChats: Chat[] = [
  {
    id: 1,
    doctorId: 101,
    fullName: "Dr. Sarah Wilson",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    lastMessage: "Please take your medicine on time.",
    unreadCount: 3,
    isFavorite: true,
    isUnread: true,
    timestamp: new Date().toISOString(),
    lastSeen: new Date().toISOString(),
    messages: [
        {
            id: 1,
            sender: 'other',
            text: "Hello! How are you feeling today?",
            time: new Date(Date.now() - 3600000).toISOString(),
            isRead: true
        },
        {
            id: 2,
            sender: 'me',
            text: "I'm feeling much better, thank you.",
            time: new Date(Date.now() - 3500000).toISOString(),
            isRead: true
        },
        {
            id: 3,
            sender: 'other',
            text: "That's great to hear. Please take your medicine on time.",
            time: new Date(Date.now() - 1000).toISOString(),
            isRead: false
        }
    ]
  },
  {
    id: 2,
    doctorId: 102,
    fullName: "Dr. Ahmed Ali",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    lastMessage: "See you next Tuesday.",
    unreadCount: 1,
    isFavorite: false,
    isUnread: true,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    lastSeen: new Date(Date.now() - 86400000).toISOString(),
    messages: [
        {
            id: 1,
            sender: 'other',
            text: "Your appointment is confirmed.",
            time: new Date(Date.now() - 90000000).toISOString(),
            isRead: true
        },
        {
            id: 2,
            sender: 'me',
            text: "Thank you, doctor.",
            time: new Date(Date.now() - 89000000).toISOString(),
            isRead: true
        },
        {
            id: 3,
            sender: 'other',
            text: "See you next Tuesday.",
            time: new Date(Date.now() - 86400000).toISOString(),
            isRead: true
        }
    ]
  },
  {
      id: 3,
      doctorId: 103,
      fullName: "Dr. Emily Chen",
      avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d",
      lastMessage: "Lab results look good.",
      unreadCount: 0,
      isFavorite: false,
      isUnread: false,
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      lastSeen: new Date(Date.now() - 172800000).toISOString(),
      messages: []
  }
];

export const mockMessages: Record<number, Message[]> = {
    1: mockChats[0].messages,
    2: mockChats[1].messages,
    3: []
};
