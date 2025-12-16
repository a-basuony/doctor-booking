import { api } from "./api";
import type { Chat, Message } from "../types/chat";
import { mockChats, mockMessages } from "./mockChatData";

const USE_MOCK_DATA = true;

export interface SendMessagePayload {
  chat_id?: number;
  user_id: number; // Assuming we need to specify who we are sending to if it's a new chat, or maybe the API handles it via route
  message: string;
  type?: 'text' | 'file';
}

export const chatService = {
  async getChats(): Promise<Chat[]> {
    if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockChats);
            }, 500); // Simulate network delay
        });
    }

    try {
      const response = await api.get("/user/chats");
      const data = response.data;
      
      let chatsArray: any[] = [];
      
      // Handle explicit "no chats yet" message from API
      if (data.message === 'no chats yet') {
          return [];
      }

      if (Array.isArray(data)) {
        chatsArray = data;
      } else if (Array.isArray(data.data)) {
        chatsArray = data.data;
      } else if (data.data && Array.isArray(data.data.rooms)) {
        // Handle { data: { rooms: [...] } }
        chatsArray = data.data.rooms;
      } else if (Array.isArray(data.chats)) {
        chatsArray = data.chats;
      } else if (Array.isArray(data.rooms)) {
        chatsArray = data.rooms;
      } else {
        console.warn("Unexpected API response structure. Expected array or object with data/chats property.", data);
        // Fallback: try to find any array property
        const keys = Object.keys(data);
        for (const key of keys) {
            if (Array.isArray(data[key])) {
                console.log(`Found array in property '${key}', using it.`);
                chatsArray = data[key];
                break;
            }
        }
      }
      
      return chatsArray; 
    } catch (error) {
      console.error("API /user/chats Error:", error);
      throw error;
    }
  },

  async getMessages(chatId: number, page: number = 1, perPage: number = 15): Promise<{ data: any[]; meta: any }> {
    if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const messages = mockMessages[chatId] || [];
                resolve({
                    data: messages,
                    meta: {
                        current_page: page,
                        last_page: 1,
                        per_page: perPage,
                        total: messages.length
                    }
                });
            }, 300);
        });
    }

    const { data } = await api.get(`/user/chats/${chatId}/messages`, {
      params: { page, per_page: perPage },
    });
    
    // Normalize response based on: { status: true, data: { data: { messages: [...] }, meta: ... } }
    let messages = [];
    let meta = {};

    if (data.data?.data?.messages) {
        messages = data.data.data.messages;
        meta = data.data.meta || {};
    } else if (data.data?.messages) {
        messages = data.data.messages;
        meta = data.meta || {};
    } else if (Array.isArray(data.data)) {
        messages = data.data;
    } else {
        messages = data;
    }

    return { data: messages, meta };
  },

  async sendMessage(payload: FormData | object): Promise<any> {
    if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let msgText = '';
                 if (payload instanceof FormData) {
                     msgText = payload.get('message') as string;
                 } else {
                     // @ts-ignore
                     msgText = payload.message;
                 }

                const newMessage: Message = {
                    id: Date.now(),
                    sender: 'me',
                    text: msgText,
                    time: new Date().toISOString(),
                    isRead: false
                };
                resolve(newMessage);
            }, 300);
        });
    }

    const { data } = await api.post("/user/chat/message", payload);
    return data.data || data;
  },

  async markMessagesAsRead(chatId: number): Promise<void> {
    if (USE_MOCK_DATA) return Promise.resolve();
    await api.patch(`/user/chats/${chatId}/messages-read-all`);
  },

  async deleteMessage(chatId: number, messageId: number): Promise<void> {
    if (USE_MOCK_DATA) return Promise.resolve();
    await api.delete(`/user/chat/${chatId}/message/${messageId}`);
  },

  async deleteChat(chatId: number): Promise<void> {
    if (USE_MOCK_DATA) return Promise.resolve();
    await api.delete(`/user/chat/${chatId}/messages`);
  },
};
