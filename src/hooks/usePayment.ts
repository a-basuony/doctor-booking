import { useMutation } from '@tanstack/react-query';
import { paymentService } from '../services/paymentService';

export const usePayment = () => {
    const processPaymentMutation = useMutation({
        mutationFn: ({ bookingId }: { bookingId: string }) =>
            paymentService.processPayment(bookingId),
    });

    return {
        processPayment: processPaymentMutation.mutateAsync,
        isProcessing: processPaymentMutation.isPending,
        error: processPaymentMutation.error,
    };
};