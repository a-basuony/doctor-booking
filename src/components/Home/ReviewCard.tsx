import React, { memo } from 'react';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import type { Review } from '../../hooks/useReviews';

interface Props {
  review: Review;
  index: number;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
}

const ReviewCard: React.FC<Props> = ({
  review,
  index,
  hoveredIndex,
  setHoveredIndex,
}) => {
  const isBlur = hoveredIndex !== null && hoveredIndex !== index;

  return (
    <div
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      className={`
        flex flex-col items-center
        p-5 rounded-xl shadow-sm
        transition-all duration-300
        ${isBlur ? 'blur-sm opacity-70 scale-95' : 'hover:scale-105'}
      `}
    >
      <img
        src={review.patient.photo || '/images/Reviews/img1.png'}
        alt={review.patient.name}
        loading="lazy"
        className="w-16 h-16 rounded-full object-cover mb-2"
      />

      <h4 className="font-georgia text-xl text-center mb-1 truncate w-full">
        {review.patient.name}
      </h4>

      <Rating
        value={review.rating}
        readOnly
        precision={0.5}
        size="small"
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
        sx={{ '& .MuiRating-iconFilled': { color: '#facc15' } }}
        className="mb-2"
      />

      <p className="text-gray-600 text-center text-sm md:text-base mb-2">
        {review.comment}
      </p>

    </div>
  );
};

export default memo(ReviewCard);
 