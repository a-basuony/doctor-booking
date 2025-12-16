import React from "react";
import { Star, Pencil } from "lucide-react";
// import { Review } from "../types";
import { FadeIn } from "./FadeIn";

export interface Review {
  id: string;
  name: string;
  avatar: string;
  timeAgo: string;
  rating: number;
  text: string;
}

interface ReviewsSectionProps {
  onAddReview: () => void;
}

const REVIEWS: Review[] = [
  {
    id: "1",
    name: "Nabila Reyna",
    avatar: "https://picsum.photos/100/100?random=1",
    timeAgo: "30 min ago",
    rating: 4.5,
    text: "Excellent service! Dr. Jessica Turner was attentive and thorough. The clinic was clean, and the staff were friendly. Highly recommend for in-person care!",
  },
  {
    id: "2",
    name: "Ferry Ichsan A",
    avatar: "https://picsum.photos/100/100?random=2",
    timeAgo: "A week ago",
    rating: 4.5,
    text: 'Quick and easy appointment! Dr. Jessica Turner was professional, and the staff made me feel comfortable. Highly recommend!"',
  },
];

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  onAddReview,
}) => {
  return (
    <div className="mt-8">
      <FadeIn delay={200}>
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-xl font-serif text-slate-800">
            Reviews and Rating
          </h3>
          <button
            onClick={onAddReview}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-700 transition-colors font-medium text-sm bg-transparent cursor-pointer mb-5"
          >
            <Pencil size={16} />
            add review
          </button>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-serif text-slate-800">4.5</span>
            <span className="text-2xl text-slate-400 font-light">/5</span>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={18}
                  className="fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="text-gray-400 text-sm font-medium">
              1250+ Reviews
            </span>
          </div>
        </div>
      </FadeIn>

      <div className="grid md:grid-cols-2 gap-4">
        {REVIEWS.map((review, index) => (
          <FadeIn key={review.id} delay={300 + index * 100}>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-3">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">
                      {review.name}
                    </h4>
                    <span className="text-gray-400 text-xs">
                      {review.timeAgo}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-yellow-600 font-bold text-xs">
                    {review.rating}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {review.text}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
};
