import React, { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "react-hot-toast";
import { api } from "../../services/api";

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorId?: string;
  bookingId?: string;
  doctorName?: string;
  onReviewSubmitted?: () => void;
}

export const AddReviewModal: React.FC<AddReviewModalProps> = ({
  isOpen,
  onClose,
  doctorId,
  bookingId,
  doctorName = "the doctor",
  onReviewSubmitted,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) {
      toast.error("Please write your review");
      return;
    }

    if (!bookingId) {
      toast.error("Booking ID is required to submit a review");
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData = {
        booking_id: bookingId,
        rating: rating.toString(),
        comment: reviewText,
      };

      console.log("Submitting review:", reviewData);

      const response = await api.post<{
        success: boolean;
        message: string;
        data?: any;
      }>("/reviews", reviewData);

      if (response.data.success) {
        toast.success("Review submitted successfully!");
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
        onClose();
        // Reset form
        setRating(5);
        setReviewText("");
      } else {
        toast.error(response.data.message || "Failed to submit review");
      }
    } catch (err: any) {
      console.error("Error submitting review:", err);
      toast.error(
        err.response?.data?.message ||
          "Unable to submit review. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300">
        <div className="mb-6">
          <h3 className="text-lg font-serif font-bold text-slate-800 mb-2">
            Rate {doctorName}
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Share your experience with other patients
          </p>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110 focus:outline-none bg-transparent"
                  disabled={isSubmitting}
                >
                  <Star
                    size={32}
                    className={`${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    } transition-colors duration-200 bg-transparent ${
                      isSubmitting ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
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
            placeholder="What was your experience like with the doctor? Share details that would help other patients."
            className="w-full h-40 p-4 rounded-2xl border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          />
          <p className="text-gray-400 text-xs mt-2">
            Your review will be visible to other patients
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitReview}
            disabled={isSubmitting || !reviewText.trim()}
            className="flex-1 py-3 bg-[#155ab6] hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit Review"
            )}
          </button>
        </div>

        {/* Booking ID Info */}
        {bookingId && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-gray-500 text-xs text-center">
              Reviewing appointment #{bookingId}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// import React, { useState } from "react";
// import { Star } from "lucide-react";

// interface AddReviewModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export const AddReviewModal: React.FC<AddReviewModalProps> = ({
//   isOpen,
//   onClose,
// }) => {
//   const [rating, setRating] = useState<number>(4);
//   const [hoverRating, setHoverRating] = useState<number>(0);
//   const [reviewText, setReviewText] = useState<string>("");

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div
//         className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
//         onClick={onClose}
//       />
//       <div className="relative bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300">
//         <div className="mb-6">
//           <h3 className="text-lg font-serif font-bold text-slate-800 mb-4">
//             Your Rate
//           </h3>
//           <div className="flex items-center justify-between">
//             <div className="flex gap-2">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <button
//                   key={star}
//                   onMouseEnter={() => setHoverRating(star)}
//                   onMouseLeave={() => setHoverRating(0)}
//                   onClick={() => setRating(star)}
//                   className="transition-transform hover:scale-110 focus:outline-none bg-transparent"
//                 >
//                   <Star
//                     size={32}
//                     className={`${
//                       star <= (hoverRating || rating)
//                         ? "fill-yellow-400 text-yellow-400"
//                         : "fill-gray-200 text-gray-200"
//                     } transition-colors duration-200 bg-transparent cursor-pointer`}
//                   />
//                 </button>
//               ))}
//             </div>
//             <div className="text-5xl font-serif text-slate-800">
//               {rating}
//               <span className="text-3xl text-slate-400 font-light">/5</span>
//             </div>
//           </div>
//         </div>

//         <div className="mb-8">
//           <h3 className="text-lg font-serif font-bold text-slate-800 mb-4">
//             Your review
//           </h3>
//           <textarea
//             value={reviewText}
//             onChange={(e) => setReviewText(e.target.value)}
//             placeholder="Write your review"
//             className="w-full h-40 p-4 rounded-2xl border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none transition-all"
//           />
//         </div>

//         <button
//           onClick={onClose}
//           className="cursor-pointer w-full py-4 bg-[#155ab6] hover:bg-blue-700 text-white font-semibold rounded-2xl transition-colors shadow-lg shadow-blue-200"
//         >
//           Send your review
//         </button>
//       </div>
//     </div>
//   );
// };
