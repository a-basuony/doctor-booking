import { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import type { StripeCardElement } from '@stripe/stripe-js';

interface AddCardModalProps {
    onSuccess: (cardElement: StripeCardElement) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            fontSize: '16px',
            color: '#1f2937',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            '::placeholder': {
                color: '#9ca3af',
            },
        },
        invalid: {
            color: '#ef4444',
            iconColor: '#ef4444',
        },
    },
    hidePostalCode: true,
};

export const AddCardModal = ({ onSuccess, onCancel, isLoading }: AddCardModalProps) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState('');
    const [cardComplete, setCardComplete] = useState(false);
    const [isStripeReady, setIsStripeReady] = useState(false);

    useEffect(() => {
        // Check if Stripe is ready
        if (stripe && elements) {
            setIsStripeReady(true);
        }
    }, [stripe, elements]);

    const handleSubmit = async () => {
        if (!stripe || !elements) {
            setError('Stripe is not loaded. Please check your internet connection and try again.');
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setError('Card element not found');
            return;
        }

        if (!cardComplete) {
            setError('Please complete card details');
            return;
        }

        try {
            setError('');
            await onSuccess(cardElement as StripeCardElement);
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to add card. Please check details.');
        }
    };

    const handleCardChange = (event: any) => {
        setError(event.error?.message || '');
        setCardComplete(event.complete);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Add Payment Card</h2>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                        ×
                    </button>
                </div>

                <div className="space-y-4 mb-4">
                    {/* Loading State */}
                    {!isStripeReady && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                            <p className="text-sm text-blue-700">Loading payment form...</p>
                        </div>
                    )}

                    {/* Card Element */}
                    {isStripeReady && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Card Details
                            </label>
                            <div className="w-full border-2 border-gray-200 rounded-xl p-4 focus-within:border-blue-500 transition-colors">
                                <CardElement 
                                    options={CARD_ELEMENT_OPTIONS}
                                    onChange={handleCardChange}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Enter your card number, expiry date, and CVC
                            </p>
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold"
                    >
                        {isLoading ? 'Adding...' : 'Add Card'}
                    </button>
                </div>
            </div>
        </div>
    );
};