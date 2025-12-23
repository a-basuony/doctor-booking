import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import { toast } from "react-hot-toast";
import type { ConversationsResponse, StartConversationResponse, MessagesResponse, SendMessageResponse } from "../types/chat";

export const useConversations = (params?: { search?: string; type?: 'unread' | 'favorites' | 'archived'; page?: number }) => {
  return useQuery<ConversationsResponse>({
    queryKey: ['conversations', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search);
      if (params?.type) queryParams.append('type', params.type);
      if (params?.page) queryParams.append('page', params.page.toString());

      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await api.get<ConversationsResponse>(`/conversations${queryString}`);
      return response.data;
    },
    staleTime: 1000 * 30,
  });
};

export const useMessages = (conversationId: number | null, enabled: boolean = true) => {
  return useQuery<MessagesResponse>({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId) throw new Error("No conversation selected");
      const response = await api.get<MessagesResponse>(`/conversations/${conversationId}`);
      return response.data;
    },
    enabled: enabled && conversationId !== null,
    staleTime: 1000 * 10,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ conversationId, body, attachment }: { conversationId: number; body: string; attachment?: File }) => {
      if (attachment) {
        const formData = new FormData();
        formData.append('body', body);
        formData.append('attachment', attachment);
        
        // Detect correct type based on MIME
        let type: 'image' | 'audio' | 'video' | 'text' = 'text';
        if (attachment.type.startsWith('image/')) type = 'image';
        else if (attachment.type.startsWith('audio/')) type = 'audio';
        else if (attachment.type.startsWith('video/')) type = 'video';
        
        formData.append('type', type);
        
        const response = await api.post<SendMessageResponse>(
          `/conversations/${conversationId}/messages`,
          formData,
          { 
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        );
        return response.data;
      } else {
        const response = await api.post<SendMessageResponse>(
          `/conversations/${conversationId}/messages`,
          { body, type: 'text' }
        );
        return response.data;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error: any) => {
      console.error("Send message error:", error);
      toast.error(error.response?.data?.message || "Failed to send message");
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ conversationId, messageId }: { conversationId: number; messageId: number }) => {
      const response = await api.delete(`/conversations/${conversationId}/messages/${messageId}`);
      return response.data;
    },
    onMutate: async ({ conversationId, messageId }) => {
      await queryClient.cancelQueries({ queryKey: ['messages', conversationId] });
      const previousMessages = queryClient.getQueryData(['messages', conversationId]);
      
      queryClient.setQueryData(['messages', conversationId], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter((msg: any) => msg.id !== messageId)
        };
      });
      
      return { previousMessages };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      toast.success("Message deleted");
    },
    onError: (error: any, variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(['messages', variables.conversationId], context.previousMessages);
      }
      toast.error(error.response?.data?.message || "Failed to delete message");
    },
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (conversationId: number) => {
      const response = await api.post(`/conversations/${conversationId}/mark-read`, {});
      return response.data;
    },
    onSuccess: (_, conversationId) => {
      queryClient.setQueryData(['conversations'], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((conv: any) => 
            conv.id === conversationId ? { ...conv, unread_count: 0 } : conv
          )
        };
      });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (conversationId: number) => {
      const response = await api.patch(`/conversations/${conversationId}/favorite`, {});
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useToggleArchive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (conversationId: number) => {
      const response = await api.patch(`/conversations/${conversationId}/archive`, {});
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useStartConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (doctorId: number) => {
      const response = await api.post<StartConversationResponse>(
        `/conversations/start`,
        { doctor_id: doctorId }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error: any) => {
      console.error("Start conversation error:", error);
      toast.error(error.response?.data?.message || "Failed to start conversation");
    },
  });
};
