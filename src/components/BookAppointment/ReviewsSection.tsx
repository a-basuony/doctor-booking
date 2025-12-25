import React, { useState, useEffect } from "react";
import { Star, Pencil } from "lucide-react";
import { FadeIn } from "./FadeIn";
import { api } from "../../services/api";

// Interface for API response
interface ApiReview {
  id: number;
  rating: number;
  comment: string;
  doctor_response: string | null;
  created_at: string;
  responded_at: string | null;
  patient: {
    id: number;
    name: string;
    photo: string | null;
  };
}

// Interface for UI review
export interface Review {
  id: string;
  name: string;
  avatar: string;
  timeAgo: string;
  rating: number;
  text: string;
  doctorResponse?: string;
}

interface ReviewsSectionProps {
  doctorId?: string;
  onAddReview: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  doctorId,
  onAddReview,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState<number>(4.5);
  const [totalReviews, setTotalReviews] = useState<number>(1250);

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    if (dateString.includes("hour")) return dateString;
    if (dateString.includes("day")) return dateString;
    if (dateString.includes("week")) return dateString;
    if (dateString.includes("month")) return dateString;
    if (dateString.includes("year")) return dateString;

    // If it's a timestamp, convert it
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    if (diffInHours < 168)
      return `${Math.floor(diffInHours / 24)} day${
        Math.floor(diffInHours / 24) > 1 ? "s" : ""
      } ago`;
    if (diffInHours < 720)
      return `${Math.floor(diffInHours / 168)} week${
        Math.floor(diffInHours / 168) > 1 ? "s" : ""
      } ago`;
    if (diffInHours < 8760)
      return `${Math.floor(diffInHours / 720)} month${
        Math.floor(diffInHours / 720) > 1 ? "s" : ""
      } ago`;
    return `${Math.floor(diffInHours / 8760)} year${
      Math.floor(diffInHours / 8760) > 1 ? "s" : ""
    } ago`;
  };

  // Get avatar URL
  const getAvatarUrl = (patient: { id: number; photo: string | null }) => {
    if (patient.photo) {
      return `https://round8-backend-team-one.huma-volve.com/storage/${patient.photo}`;
    }
    // Fallback to random avatar based on patient ID
    return `https://picsum.photos/100/100?random=${patient.id}`;
  };

  // Fetch reviews
  const fetchReviews = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Try to fetch doctor-specific reviews first
      if (doctorId) {
        try {
          const doctorResponse = await api.get<{
            success: boolean;
            data: ApiReview[];
          }>(`/doctors/${doctorId}/reviews`);

          if (doctorResponse.data.success && doctorResponse.data.data) {
            processReviews(doctorResponse.data.data);
            return;
          }
        } catch (doctorError) {
          console.log(
            "No doctor-specific reviews endpoint, falling back to all reviews"
          );
        }
      }

      // Fallback to all reviews
      const response = await api.get<{
        success: boolean;
        data: ApiReview[];
      }>("/reviews/all");

      if (response.data.success && response.data.data) {
        processReviews(response.data.data);
      } else {
        setError("Failed to load reviews");
        // Use fallback data
        setReviews([
          {
            id: "fallback-1",
            name: "Nabila Reyna",
            avatar: "https://picsum.photos/100/100?random=1",
            timeAgo: "30 min ago",
            rating: 4.5,
            text: "Excellent service! The doctor was attentive and thorough. The clinic was clean, and the staff were friendly.",
          },
          {
            id: "fallback-2",
            name: "Ferry Ichsan A",
            avatar: "https://picsum.photos/100/100?random=2",
            timeAgo: "A week ago",
            rating: 4.5,
            text: "Quick and easy appointment! The doctor was professional, and the staff made me feel comfortable.",
          },
        ]);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Unable to load reviews. Please try again later.");
      // Use fallback data
      setReviews([
        {
          id: "fallback-1",
          name: "Nabila Reyna",
          avatar: "https://picsum.photos/100/100?random=1",
          timeAgo: "30 min ago",
          rating: 4.5,
          text: "Excellent service! The doctor was attentive and thorough. The clinic was clean, and the staff were friendly.",
        },
        {
          id: "fallback-2",
          name: "Ferry Ichsan A",
          avatar: "https://picsum.photos/100/100?random=2",
          timeAgo: "A week ago",
          rating: 4.5,
          text: "Quick and easy appointment! The doctor was professional, and the staff made me feel comfortable.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Process reviews from API
  const processReviews = (apiReviews: ApiReview[]) => {
    const processedReviews: Review[] = apiReviews.map((review) => ({
      id: review.id.toString(),
      name: review.patient.name || "Anonymous",
      avatar: getAvatarUrl(review.patient),
      timeAgo: formatTimeAgo(review.created_at),
      rating: review.rating,
      text: review.comment,
      doctorResponse: review.doctor_response || undefined,
    }));

    setReviews(processedReviews);

    // Calculate average rating
    if (processedReviews.length > 0) {
      const total = processedReviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      setAverageRating(
        parseFloat((total / processedReviews.length).toFixed(1))
      );
      setTotalReviews(processedReviews.length);
    }
  };

  // Load reviews on mount
  useEffect(() => {
    fetchReviews();
  }, [doctorId]);

  // Loading skeleton
  const renderSkeleton = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-8">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-1/6 animate-pulse"></div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-2xl border border-gray-200 animate-pulse"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-12"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Error state
  const renderError = () => (
    <div className="text-center py-8">
      <p className="text-red-500 mb-4">{error}</p>
      <button
        onClick={fetchReviews}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Retry Loading Reviews
      </button>
    </div>
  );

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
            <span className="text-4xl font-serif text-slate-800">
              {averageRating}
            </span>
            <span className="text-2xl text-slate-400 font-light">/5</span>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={18}
                  className={`${
                    s <= Math.floor(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : s === Math.ceil(averageRating) &&
                        averageRating % 1 > 0.5
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-400 text-sm font-medium">
              {totalReviews}+ Reviews
            </span>
          </div>
        </div>
      </FadeIn>

      {isLoading ? (
        renderSkeleton()
      ) : error ? (
        renderError()
      ) : reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No reviews yet</p>
          <p className="text-gray-400 text-sm">
            Be the first to share your experience!
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {reviews.slice(0, 4).map((review, index) => (
            <FadeIn key={review.id} delay={300 + index * 100}>
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-3">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        (
                          e.target as HTMLImageElement
                        ).src = `https://picsum.photos/100/100?random=${review.id}`;
                      }}
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
                    <Star
                      size={12}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span className="text-yellow-600 font-bold text-xs">
                      {review.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  {review.text}
                </p>

                {/* Doctor Response */}
                {review.doctorResponse && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Star size={12} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-blue-800 mb-1">
                          Doctor's Response
                        </p>
                        <p className="text-gray-600 text-xs leading-relaxed">
                          {review.doctorResponse}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      )}

      {/* View All Reviews Button */}
      {reviews.length > 4 && (
        <div className="text-center mt-6">
          <button
            onClick={() => {
              // You can implement a modal or separate page for all reviews
              console.log("View all reviews");
            }}
            className="text-blue-500 hover:text-blue-700 transition-colors font-medium text-sm"
          >
            View all {reviews.length} reviews
          </button>
        </div>
      )}
    </div>
  );
};
