import { useMutation } from '@tanstack/react-query';
import { paymentService } from '../services/paymentService';

export const usePayment = () => {
    const createIntentMutation = useMutation({
        mutationFn: ({ amount, appointmentId }: { amount: number; appointmentId: string }) =>
            paymentService.createPaymentIntent(amount, appointmentId),
    });

    const processPaymentMutation = useMutation({
        mutationFn: ({
            paymentIntentId,
            paymentMethodId,
            appointmentId
        }: {
            paymentIntentId: string;
            paymentMethodId: string;
            appointmentId: string;
        }) => paymentService.processPayment(paymentIntentId, paymentMethodId, appointmentId),
    });

    return {
        createPaymentIntent: createIntentMutation.mutateAsync,
        processPayment: processPaymentMutation.mutateAsync,
        isCreating: createIntentMutation.isPending, 
        isProcessing: processPaymentMutation.isPending, 
        error: processPaymentMutation.error,
    };
};