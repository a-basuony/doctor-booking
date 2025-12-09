import { useState } from "react";
import {
  Typography,
  Box,
  Button,
  Avatar,
  IconButton,
  Rating,
} from "@mui/material";
import { FaArrowLeft, FaPencilAlt, FaStar, FaCheckCircle, FaHeart, FaRegHeart } from "react-icons/fa";
import { AddReviewModal } from "../components/doctordetails/AddReviewModal";
import { useDoctorDetails } from "../hooks/useDoctorDetails";
import { FaUserGroup, FaBriefcase, FaCommentDots } from "react-icons/fa6";
import AboutSection from "../components/doctordetails/AboutSection";
import { toast } from "react-hot-toast";
import type { IReviews } from "../types/index"

const DoctorDetailsPage = () => {
  const { doctor, reviews, loading, addReview } = useDoctorDetails("1");
  const [modalOpen, setModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed IDoctor from favorites" : "Added IDoctor to favorites");
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!doctor) return <div className="p-10 text-center">IDoctor not found</div>;

  return (
    <div className="min-h-screen bg-neutral-50 flex justify-center">
      <Box className="w-full max-w-screen-xl bg-white shadow-lg rounded-xl p-8 md:p-12 space-y-10">
        {/* Header */}
        <Box className="flex items-center mb-6">
          <IconButton onClick={() => window.history.back()} className="mr-4">
            <FaArrowLeft className="text-2xl text-primary-500" />
          </IconButton>
          <Typography variant="h5" className="font-bold text-primary-500">
            IDoctor Details
          </Typography>
        </Box>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_2fr] gap-10">
          {/* Left Column */}
          <div className="flex flex-col space-y-8">
            <Box className="flex items-center gap-6">
              <Box className="relative">
                <Avatar
                  src={doctor.image || "/doctor.jpg"}
                  alt={doctor.name}
                  className="!w-28 !h-28 md:!w-32 md:!h-32 border-2 border-primary-500"
                />
              </Box>

              <Box className="flex flex-col justify-between space-y-1">
                <Box className="flex items-center gap-2">
                  <Typography variant="h4" className="font-bold text-primary-700">
                    {doctor.name}
                  </Typography>
                  <FaCheckCircle className="text-primary-500 text-xl" />
                  <span
                    onClick={handleFavorite}
                    className="cursor-pointer transition-transform hover:scale-110 ml-4"
                  >
                    {isFavorite ? (
                      <FaHeart className="text-2xl text-error-500" />
                    ) : (
                      <FaRegHeart className="text-2xl text-neutral-400" />
                    )}
                  </span>
                </Box>
                <Typography variant="subtitle1" className="text-secondary-700">{doctor.specialty}</Typography>
                <Typography variant="body2" className="text-neutral-600">
                  {doctor.location.address}
                </Typography>
              </Box>
            </Box>
            {/* Stats */}
            <Box className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 border-b border-neutral-200 pb-6">
              <Box className="flex flex-col items-center text-center space-y-1">
                <FaUserGroup className="text-secondary-500 text-2xl" />
                <Typography className="font-bold text-secondary-700">2,000+</Typography>
                <Typography className="text-sm text-neutral-500">patients</Typography>
              </Box>
              <Box className="flex flex-col items-center text-center space-y-1">
                <FaBriefcase className="text-secondary-500 text-2xl" />
                <Typography className="font-bold text-secondary-700">10+</Typography>
                <Typography className="text-sm text-neutral-500">experience</Typography>
              </Box>
              <Box className="flex flex-col items-center text-center space-y-1">
                <FaStar className="text-secondary-500 text-2xl" />
                <Typography className="font-bold text-secondary-700">{doctor.rating}</Typography>
                <Typography className="text-sm text-neutral-500">rating</Typography>
              </Box>
              <Box className="flex flex-col items-center text-center space-y-1">
                <FaCommentDots className="text-secondary-500 text-2xl" />
                <Typography className="font-bold text-secondary-700">{reviews.length}</Typography>
                <Typography className="text-sm text-neutral-500">reviews</Typography>
              </Box>
            </Box>

            {/* About */}
            <Box className="space-y-2">
              <AboutSection text={doctor.about} />
            </Box>
          </div>

          {/* Right Column */}
          <div className="flex flex-col space-y-8 bg-neutral-50 p-6 rounded-xl md:p-8">
            {/* Rating Overview */}
            <Box className="space-y-2">
              <Typography variant="h5" className="font-bold text-primary-700">
                Reviews and Rating
              </Typography>
              <Box className="flex items-center gap-3">
                <Rating value={doctor.rating} precision={0.5} readOnly />
                <Typography className="font-bold text-lg text-secondary-700">{doctor.rating}/5</Typography>
                <Typography className="text-secondary-600">{reviews.length} Reviews</Typography>
                <Button
                  startIcon={<FaPencilAlt />}
                  variant="contained"
                  onClick={() => setModalOpen(true)}
                  className="ml-auto rounded-xl bg-primary-500 hover:bg-primary-600 text-white"
                >
                  Add Review
                </Button>
              </Box>
            </Box>

            {/* Reviews List */}
            <Box className="space-y-4 max-h-96 overflow-y-auto">
              {reviews.map((rev) => (
                <Box
                  key={rev.id}
                  className="p-4 bg-white rounded-lg shadow-sm space-y-2"
                >
                  <Box className="flex justify-between items-start">
                    <Box className="flex items-center gap-3">
                      <Avatar src={rev.avatar} />
                      <Box>
                        <Typography className="font-bold text-secondary-700">{rev.name}</Typography>
                        <Typography className="text-xs text-neutral-500">
                          {rev.time}
                        </Typography>
                      </Box>
                    </Box>
                    <Box className="flex items-center gap-1 p-0.5 rounded-md bg-warning-200/50">
                      <FaStar className="text-warning-500" />
                      <Typography className="font-semibold text-warning-700">{rev.rating}</Typography>
                    </Box>
                  </Box>
                  <Typography className="text-neutral-700">{rev.comment}</Typography>
                </Box>
              ))}
            </Box>

            {/* Booking */}
            <Box className="pt-4 space-y-4">
              <Box className="flex justify-between items-baseline">
                <Typography variant="h6" className="font-semibold text-secondary-700">
                  Price
                  <span className="ml-1 text-sm text-neutral-500">/ hour</span>
                </Typography>
                <Typography variant="h5" className="font-extrabold text-error-500">
                  ${doctor.price}
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="large"
                fullWidth
                className="rounded-lg bg-primary-500 hover:bg-primary-600 text-white"
              >
                Book Appointment
              </Button>
            </Box>
          </div>
        </div>
      </Box>

      {/* Add Review Modal */}
      <AddReviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(data: IReviews) => {
          addReview(data);
          setModalOpen(false);
        }}
      />
    </div>
  );
};

export default DoctorDetailsPage;
