import * as React from 'react';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';

type ReviewsSectionProps = {
  title?: string;
  subtitle?: string;
  reviewText?: string;
  reviewerName?: string;
};

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

export default function ReviewsSection({}: ReviewsSectionProps) {
  const [value, setValue] = React.useState<number | null>(5);
  const [hover, setHover] = React.useState(-1);

  const reviewers = [
    { id: 1, img: "/images/Reviews/img1.png", name: "Reviewer 1", marginTop: "0" },
    { id: 2, img: "/images/Reviews/img2.png", name: "Reviewer 2", marginTop: "-20px" },
    { id: 3, img: "/images/Reviews/img3.png", name: "Reviewer 3", marginTop: "-30px" },
    { id: 4, img: "/images/Reviews/img4.png", name: "Reviewer 4", marginTop: "-20px" },
    { id: 5, img: "/images/Reviews/img5.png", name: "Reviewer 5", marginTop: "0" },
  ];

  return (
    <section className="w-full bg-white py-10 md:py-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-serif font-normal text-gray-900 mb-2
                         text-[28px] md:text-4xl">
            Reviews<br />That Speak for Themselves
          </h2>
        </div>

        {/* Review Card */}
        <div className="max-w-3xl mx-auto">

          {/* Rating */}
          <div className="flex justify-center mb-8">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Rating
                name="hover-feedback"
                value={value}
                precision={0.5}
                getLabelText={getLabelText}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
                onChangeActive={(event, newHover) => {
                  setHover(newHover);
                }}
                size="large"
                sx={{
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  '& .MuiRating-iconFilled': { color: '#facc15' },
                  '& .MuiRating-iconHover': { color: '#fbbf24' },
                }}
                emptyIcon={
                  <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                }
              />
            </Box>
          </div>

          {/* Review Text */}
          <div className="mb-8 pb-12">
            <p className="text-center text-gray-500 font-serif font-normal leading-relaxed
                          text-[18px] md:text-2xl">
              Quick and easy booking! I found a<br />
              great dermatologist near me and<br />
              booked an appointment in just a<br />
              few minutes.
            </p>
          </div>

          {/* Reviewer Images */}
          <div className="flex justify-center items-end gap-2 flex-nowrap overflow-x-hidden">
            {reviewers.map((reviewer, index) => (
              <div
                key={reviewer.id}
                style={{ marginTop: reviewer.marginTop }}
                className={`
                  ${index === 2
                    ? 'w-20 h-20 md:w-36 md:h-36'
                    : 'w-16 h-16 md:w-28 md:h-28'}
                  rounded-full overflow-hidden flex-shrink-0
                `}
              >
                <img
                  src={reviewer.img}
                  alt={reviewer.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}