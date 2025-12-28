import React, { useState } from 'react';
import type { SavedCard } from '../../types/index';
import { CreditCard, Trash2, Edit2, Star } from 'lucide-react';
import EditCardModal from './EditCardModal';

interface SavedCardsListProps {
  cards: SavedCard[];
  selectedCardId: number | null;
  onSelectCard: (cardId: number) => void;
  onDeleteCard: (cardId: number) => void;
  onSetDefault: (cardId: number) => void;
  isDeleting: boolean;
  isSettingDefault: boolean;
}

const SavedCardsList: React.FC<SavedCardsListProps> = ({
  cards,
  selectedCardId,
  onSelectCard,
  onDeleteCard,
  onSetDefault,
  isDeleting,
  isSettingDefault,
}) => {
  const [editingCard, setEditingCard] = useState<SavedCard | null>(null);

  const getCardIcon = (brand: string) => {
    return <CreditCard className="w-6 h-6" />;
  };

  const formatCardBrand = (brand: string) => {
    return brand.charAt(0).toUpperCase() + brand.slice(1);
  };

  if (cards.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p>No saved cards yet</p>
        <p className="text-sm mt-2">Add a card to save it for future payments</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
              selectedCardId === card.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => onSelectCard(card.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-gray-600">
                  {getCardIcon(card.brand)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold text-gray-900">
                      {formatCardBrand(card.brand)} •••• {card.last_four}
                    </p>
                    {card.is_default && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Expires {card.exp_month.toString().padStart(2, '0')}/{card.exp_year}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {!card.is_default && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetDefault(card.id);
                    }}
                    disabled={isSettingDefault}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50"
                    title="Set as default"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingCard(card);
                  }}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="Edit card"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Are you sure you want to delete this card?')) {
                      onDeleteCard(card.id);
                    }
                  }}
                  disabled={isDeleting}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                  title="Delete card"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {selectedCardId === card.id && (
              <div className="absolute top-2 right-2">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {editingCard && (
        <EditCardModal
          card={editingCard}
          onClose={() => setEditingCard(null)}
        />
      )}
    </>
  );
};

export default SavedCardsList;
