import { useMutation } from '@tanstack/react-query';
import { paymentService } from '../services/paymentService';

export const usePayment = () => {
    const processPaymentMutation = useMutation({
        mutationFn: ({
            bookingId,
            paymentMethodId
        }: {
            bookingId: string;
            paymentMethodId?: string;
        }) => paymentService.processPayment(bookingId, paymentMethodId),
    });

    return {
        processPayment: processPaymentMutation.mutateAsync,
        isProcessing: processPaymentMutation.isPending, 
        error: processPaymentMutation.error,
    };
};