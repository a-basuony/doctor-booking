import { AlertCircle } from 'lucide-react';

interface DeleteCardConfirmModalProps {
    cardBrand: string;
    cardLastFour: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDeleting?: boolean;
}

export const DeleteCardConfirmModal = ({
    cardBrand,
    cardLastFour,
    onConfirm,
    onCancel,
    isDeleting
}: DeleteCardConfirmModalProps) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
                <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Delete Card
                        </h2>
                        <p className="text-gray-600">
                            Are you sure you want to delete this card?
                        </p>
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="font-medium text-gray-900">
                                {cardBrand} •••• {cardLastFour}
                            </p>
                        </div>
                        <p className="text-sm text-gray-500 mt-3">
                            This action cannot be undone.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-3 rounded-xl font-semibold transition-colors"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Card'}
                    </button>
                </div>
            </div>
        </div>
    );
};
