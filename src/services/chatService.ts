import { api } from "./api";
import type { Chat } from "../types/chat";

export interface SendMessagePayload {
  chat_id?: number;
  user_id: number; // Assuming we need to specify who we are sending to if it's a new chat, or maybe the API handles it via route
  message: string;
  type?: 'text' | 'file';
}

export const chatService = {
  async getChats(): Promise<Chat[]> {
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
    const { data } = await api.post("/user/chat/message", payload);
    return data.data || data;
  },

  async markMessagesAsRead(chatId: number): Promise<void> {
    await api.patch(`/user/chats/${chatId}/messages-read-all`);
  },

  async deleteMessage(chatId: number, messageId: number): Promise<void> {
    await api.delete(`/user/chat/${chatId}/message/${messageId}`);
  },

  async deleteChat(chatId: number): Promise<void> {
    await api.delete(`/user/chat/${chatId}/messages`);
  },
};
