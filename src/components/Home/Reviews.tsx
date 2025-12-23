import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import ReviewCard from '../Home/ReviewCard';
import { useReviews } from '../../hooks/useReviews';
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";

const labels: { [index: string]: string } = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

const fallbackReviewers = [
  { id: 1, img: '/images/Reviews/img1.png', marginTop: '0' },
  { id: 2, img: '/images/Reviews/img2.png', marginTop: '-20px' },
  { id: 3, img: '/images/Reviews/img3.png', marginTop: '0' },
  { id: 4, img: '/images/Reviews/img4.png', marginTop: '-20px' },
  { id: 5, img: '/images/Reviews/img5.png', marginTop: '0' },
];

export default function ReviewsSection() {
  const { reviews } = useReviews();
  const [value, setValue] = useState<number | null>(5);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // محاكاة جلب البيانات
    if (reviews.length > 0) {
      setLoading(false);
    }
  }, [reviews]);

  /* 🔹 تحديد عدد الكروت حسب الشاشة */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
      setCurrentIndex(0);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(reviews.length - visibleCards, 0);

  if (loading) {
    return (
      <section className="w-full bg-white py-10 md:py-20 text-center text-gray-600">
        Loading reviews...
      </section>
    );
  }

  return (
    <section className="w-full bg-white py-10 md:py-20">
      <div className="max-w-6xl mx-auto px-6 ">
        <div className="text-center mb-10 ">
          <h2 className="font-serif text-gray-900 mb-2 text-[28px] md:text-4xl">
            Reviews<br />That Speak for Themselves
          </h2>
        </div>

        <div className="max-w-3xl mx-auto  ">
          {reviews.length > 0 ? (
            <div className="relative overflow-hidden  ">
              {/* ⬅ Left Arrow */}
              <button
                onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
                disabled={currentIndex === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10
                           w-10 h-10 rounded-full bg-white shadow
                           flex items-center justify-center
                           disabled:opacity-40 text-3xl"
              >
                <SlArrowLeft />
              </button>

              {/* ➡ Right Arrow */}
              <button
                onClick={() =>
                  setCurrentIndex(prev => Math.min(prev + 1, maxIndex))
                }
                disabled={currentIndex === maxIndex}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10
                           w-10 h-10 rounded-full bg-white shadow
                           flex items-center justify-center
                           disabled:opacity-40 text-3xl"
              >
                <SlArrowRight />
              </button>

              {/* Slider */}
              <div
                className="flex transition-transform duration-500"
                style={{
                  transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                }}
              >
                {reviews.map((review, index) => (
                  <div
                    key={review.id || index}
                    style={{ width: `${100 / visibleCards}%` }}
                    className="px-3 flex-shrink-0"
                  >
                    <ReviewCard
                      review={review}
                      index={index}
                      hoveredIndex={hoveredIndex}
                      setHoveredIndex={setHoveredIndex}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Fallback */}
              <div className="flex justify-center mb-8">
                <Box>
                  <Rating
                    value={value}
                    precision={0.5}
                    getLabelText={getLabelText}
                    onChange={(_e, newValue) => setValue(newValue)}
                    size="large"
                    sx={{
                      fontSize: { xs: '2rem', md: '2.5rem' },
                      '& .MuiRating-iconFilled': { color: '#facc15' },
                    }}
                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                  />
                </Box>
              </div>

              <div className="mb-8 pb-12 text-center text-gray-500 font-serif text-[18px] md:text-2xl leading-relaxed">
                Quick and easy booking! I found a<br />
                great dermatologist near me and<br />
                booked an appointment in just a<br />
                few minutes.
              </div>

              <div className="flex justify-center items-end gap-2">
                {fallbackReviewers.map((reviewer) => (
                  <div
                    key={reviewer.id}
                    style={{ marginTop: reviewer.marginTop }}
                    className={`${
                      reviewer.id === 3
                        ? 'w-20 h-20 md:w-36 md:h-36'
                        : 'w-16 h-16 md:w-28 md:h-28'
                    } rounded-full overflow-hidden`}
                  >
                    <img
                      src={reviewer.img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
 