import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentAPI } from '../services/api';
import type { SavedCard, SaveCardRequest, UpdateCardRequest, SavedCardsResponse, SavedCardResponse } from '../types/index';
import toast from 'react-hot-toast';

export const useSavedCards = () => {
   const queryClient = useQueryClient();

   const query = useQuery<SavedCard[]>({
      queryKey: ['saved-cards'],
      queryFn: async () => {
         const response = await paymentAPI.listCards();
         const data = response.data as SavedCardsResponse;
         console.log('📦 Fetched saved cards:', data.data);
         return data.data;
      },
   });

   const addMutation = useMutation({
      mutationFn: async (cardData: SaveCardRequest) => {
         const response = await paymentAPI.saveCard(cardData);
         const data = response.data as SavedCardResponse;
         return data.data;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['saved-cards'] });
         toast.success('Card saved successfully');
      },
      onError: (error: any) => {
         toast.error(error.response?.data?.message || 'Failed to save card');
      },
   });

   const updateMutation = useMutation({
      mutationFn: async ({ id, data }: { id: number; data: UpdateCardRequest }) => {
         const response = await paymentAPI.updateCard(id, data);
         const responseData = response.data as SavedCardResponse;
         return responseData.data;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['saved-cards'] });
         toast.success('Card updated successfully');
      },
      onError: (error: any) => {
         toast.error(error.response?.data?.message || 'Failed to update card');
      },
   });

   const deleteMutation = useMutation({
      mutationFn: async (id: number) => {
         await paymentAPI.deleteCard(id);
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['saved-cards'] });
         toast.success('Card deleted successfully');
      },
      onError: (error: any) => {
         toast.error(error.response?.data?.message || 'Failed to delete card');
      },
   });

   const setDefaultMutation = useMutation({
      mutationFn: async (id: number) => {
         await paymentAPI.setDefaultCard(id);
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['saved-cards'] });
         toast.success('Default card updated');
      },
      onError: (error: any) => {
         toast.error(error.response?.data?.message || 'Failed to set default card');
      },
   });

   return {
      cards: query.data ?? [],
      loading: query.isLoading,
      error: query.error,
      addCard: addMutation.mutateAsync,
      updateCard: updateMutation.mutateAsync,
      deleteCard: deleteMutation.mutateAsync,
      setDefaultCard: setDefaultMutation.mutateAsync,
      isAdding: addMutation.isPending,
      isUpdating: updateMutation.isPending,
      isDeleting: deleteMutation.isPending,
      isSettingDefault: setDefaultMutation.isPending,
   };
};

// Keep the old hook for backward compatibility
export const usePaymentMethods = useSavedCards;