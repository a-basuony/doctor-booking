import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '../services/paymentService';

export const usePaymentMethods = () => {
   const queryClient = useQueryClient();
   const query = useQuery({
      queryKey: ['payment-methods'],
      queryFn: paymentService.getPaymentMethods,
   });

   const addMutation = useMutation({
      mutationFn: (cardElement: any) =>
         paymentService.addPaymentMethod(cardElement),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      },
   });

   const deleteMutation = useMutation({
      mutationFn: (paymentMethodId: string) =>
         paymentService.deletePaymentMethod(paymentMethodId),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      },
   });

   const setDefaultMutation = useMutation({
      mutationFn: (paymentMethodId: string) =>
         paymentService.setDefaultPaymentMethod(paymentMethodId),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      },
   });

   return {
      paymentMethods: query.data ?? [],
      loading: query.isLoading,
      error: query.error,
      addPaymentMethod: addMutation.mutateAsync,
      deletePaymentMethod: deleteMutation.mutateAsync,
      setDefaultPaymentMethod: setDefaultMutation.mutateAsync,
      isAdding: addMutation.isPending,
      isDeleting: deleteMutation.isPending,
      isSettingDefault: setDefaultMutation.isPending,
   };
};