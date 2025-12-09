import { useState } from 'react';
import type { CardFormData } from '../../types/';

interface AddCardModalProps {
    onSuccess: (cardData: CardFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export const AddCardModal = ({ onSuccess, onCancel, isLoading }: AddCardModalProps) => {
    const [formData, setFormData] = useState<CardFormData>({
        cardNumber: '',
        cardholderName: '',
        expiry: '',
        cvc: ''
    });
    const [error, setError] = useState('');

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const parts = [];
        for (let i = 0; i < Math.min(v.length, 16); i += 4) {
            parts.push(v.substring(i, i + 4));
        }
        return parts.join(' ');
    };

    const formatExpiry = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) return v.slice(0, 2) + '/' + v.slice(2, 4);
        return v;
    };

    const validateForm = (): boolean => {
        const cleanNumber = formData.cardNumber.replace(/\s/g, '');
        
        if (!formData.cardholderName.trim()) {
            setError('Cardholder name is required');
            return false;
        }
        if (cleanNumber.length !== 16) {
            setError('Invalid card number (must be 16 digits)');
            return false;
        }
        if (!formData.expiry.match(/^\d{2}\/\d{2}$/)) {
            setError('Invalid expiry date (MM/YY)');
            return false;
        }
        if (formData.cvc.length < 3) {
            setError('Invalid CVC');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        
        try {
            await onSuccess(formData);
        } catch (err) {
            setError('Failed to add card. Please check details.');
        }
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
                    {/* Cardholder Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cardholder Name
                        </label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={formData.cardholderName}
                            onChange={(e) => setFormData({...formData, cardholderName: e.target.value})}
                            className="w-full border-2 border-gray-200 rounded-xl p-4 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Card Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Number
                        </label>
                        <input
                            type="text"
                            maxLength={19}
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={(e) => setFormData({...formData, cardNumber: formatCardNumber(e.target.value)})}
                            className="w-full border-2 border-gray-200 rounded-xl p-4 outline-none focus:border-blue-500 font-mono"
                        />
                    </div>

                    {/* Expiry & CVC */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Expiry
                            </label>
                            <input
                                type="text"
                                maxLength={5}
                                placeholder="MM/YY"
                                value={formData.expiry}
                                onChange={(e) => setFormData({...formData, expiry: formatExpiry(e.target.value)})}
                                className="w-full border-2 border-gray-200 rounded-xl p-4 outline-none focus:border-blue-500 font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                CVC
                            </label>
                            <input
                                type="text"
                                maxLength={4}
                                placeholder="123"
                                value={formData.cvc}
                                onChange={(e) => setFormData({...formData, cvc: e.target.value.replace(/[^0-9]/g, '')})}
                                className="w-full border-2 border-gray-200 rounded-xl p-4 outline-none focus:border-blue-500 font-mono"
                            />
                        </div>
                    </div>
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