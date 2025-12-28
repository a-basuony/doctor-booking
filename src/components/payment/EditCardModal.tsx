import React, { useState } from 'react';
import type { SavedCard, UpdateCardRequest } from '../../types/index';
import { X } from 'lucide-react';
import { useSavedCards } from '../../hooks/usePaymentMethods';

interface EditCardModalProps {
  card: SavedCard;
  onClose: () => void;
}

const EditCardModal: React.FC<EditCardModalProps> = ({ card, onClose }) => {
  const { updateCard, isUpdating } = useSavedCards();
  const [formData, setFormData] = useState({
    exp_month: card.exp_month,
    exp_year: card.exp_year,
    is_default: card.is_default,
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updateData: UpdateCardRequest = {
      exp_month: formData.exp_month,
      exp_year: formData.exp_year,
      is_default: formData.is_default,
    };

    try {
      await updateCard({ id: card.id, data: updateData });
      onClose();
    } catch (error) {
      console.error('Failed to update card:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Card</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isUpdating}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Details
            </label>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {card.brand.toUpperCase()} •••• {card.last_four}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiration Date
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <select
                  value={formData.exp_month}
                  onChange={(e) =>
                    setFormData({ ...formData, exp_month: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isUpdating}
                  required
                >
                  <option value="">Month</option>
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={formData.exp_year}
                  onChange={(e) =>
                    setFormData({ ...formData, exp_year: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isUpdating}
                  required
                >
                  <option value="">Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_default}
                onChange={(e) =>
                  setFormData({ ...formData, is_default: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled={isUpdating}
              />
              <span className="text-sm text-gray-700">Set as default payment method</span>
            </label>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isUpdating}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? 'Updating...' : 'Update Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCardModal;
