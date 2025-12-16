import React, { useState } from "react";
import { Star, X } from "lucide-react";

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddReviewModal: React.FC<AddReviewModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [rating, setRating] = useState<number>(4);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300">
        <div className="mb-6">
          <h3 className="text-lg font-serif font-bold text-slate-800 mb-4">
            Your Rate
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110 focus:outline-none bg-transparent"
                >
                  <Star
                    size={32}
                    className={`${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    } transition-colors duration-200 bg-transparent cursor-pointer`}
                  />
                </button>
              ))}
            </div>
            <div className="text-5xl font-serif text-slate-800">
              {rating}
              <span className="text-3xl text-slate-400 font-light">/5</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-serif font-bold text-slate-800 mb-4">
            Your review
          </h3>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review"
            className="w-full h-40 p-4 rounded-2xl border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none transition-all"
          />
        </div>

        <button
          onClick={onClose}
          className="cursor-pointer w-full py-4 bg-[#155ab6] hover:bg-blue-700 text-white font-semibold rounded-2xl transition-colors shadow-lg shadow-blue-200"
        >
          Send your review
        </button>
      </div>
    </div>
  );
};
