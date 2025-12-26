import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Avatar,
  IconButton,
  Rating,
} from "@mui/material";
import {
  FaArrowLeft,
  FaPencilAlt,
  FaStar,
  FaCheckCircle,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { AddReviewModal } from "../components/doctordetails/AddReviewModal";
import { FaUserGroup, FaBriefcase, FaCommentDots } from "react-icons/fa6";
import AboutSection from "../components/doctordetails/AboutSection";
import { toast } from "react-hot-toast";
import type { IReviews } from "../types/index";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";

interface ApiDoctor {
  id: number;
  name: string;
  email: string;
  mobile: string | null;
  profile_photo: string | null;
  specialty: {
    id: number;
    name: string;
    image: string;
  };
  license_number: string;
  bio: string | null;
  session_price: number;
  clinic_address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  experience_years: number;
}

interface DoctorDetails {
  id: number;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  price: number;
  about: string;
  location: {
    address: string;
  };
}

const DoctorDetailsPage = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<DoctorDetails | null>(null);
  const [reviews, setReviews] = useState<IReviews[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userBookingId, setUserBookingId] = useState<string | null>(null);

  // Function to get latest booking ID for this doctor
  const getLatestBookingId = () => {
    if (!doctorId) return null;

    // Check localStorage for doctor-specific booking
    const doctorBookingId = localStorage.getItem(
      `doctor_${doctorId}_booking_id`
    );
    if (doctorBookingId) return doctorBookingId;

    // Check sessionStorage
    const sessionBookingId = sessionStorage.getItem(`current_booking_id`);
    if (sessionBookingId) return sessionBookingId;

    // Check for any booking ID in localStorage
    const keys = Object.keys(localStorage);
    const bookingKey = keys.find(
      (key) => key.startsWith("doctor_") && key.endsWith("_booking_id")
    );
    if (bookingKey) {
      return localStorage.getItem(bookingKey);
    }

    return null;
  };

  // Check if user has already reviewed
  const hasUserReviewed = (bookingId: string) => {
    return localStorage.getItem(`review_submitted_${bookingId}`) === "true";
  };

  // Fetch doctor details
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      if (!doctorId) return;

      setLoading(true);
      try {
        // Fetch doctor data
        const response = await api.get<{
          success: boolean;
          message: string;
          data: ApiDoctor;
        }>(`/doctors/${doctorId}`);

        if (response.data.success && response.data.data) {
          const apiDoctor = response.data.data;

          // Transform API data to match your component's expected format
          const doctorDetails: DoctorDetails = {
            id: apiDoctor.id,
            name: apiDoctor.name,
            specialty: apiDoctor.specialty?.name || "General Practitioner",
            image: apiDoctor.profile_photo
              ? `https://round8-backend-team-one.huma-volve.com/storage/${apiDoctor.profile_photo}`
              : `https://picsum.photos/150/150?random=${apiDoctor.id}`,
            rating: 4.5, // You might want to calculate this from reviews
            price: apiDoctor.session_price,
            about:
              apiDoctor.bio || "Experienced doctor with years of practice.",
            location: {
              address: apiDoctor.clinic_address || "Cairo, Egypt",
            },
          };

          setDoctor(doctorDetails);

          // Fetch reviews for this doctor
          // Assuming you have an endpoint for reviews
          // const reviewsResponse = await api.get(`/doctors/${doctorId}/reviews`);
          // setReviews(reviewsResponse.data.data || []);

          // For now, use mock reviews
          setReviews([
            {
              id: "1",
              name: "John Doe",
              avatar: "https://randomuser.me/api/portraits/men/1.jpg",
              rating: 4.5,
              time: "2 days ago",
              comment: "Great doctor, very professional and caring.",
            },
            {
              id: "2",
              name: "Jane Smith",
              avatar: "https://randomuser.me/api/portraits/women/2.jpg",
              rating: 5,
              time: "1 week ago",
              comment: "Excellent service and very knowledgeable.",
            },
          ]);

          // Get latest booking ID for this doctor
          const bookingId = getLatestBookingId();
          setUserBookingId(bookingId);
        }
      } catch (error) {
        console.error("Error fetching doctor details:", error);
        toast.error("Failed to load doctor details");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [doctorId]);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(
      isFavorite
        ? `Removed ${doctor?.name} from favorites`
        : `Added ${doctor?.name} to favorites`
    );
  };

  const handleAddReviewClick = () => {
    // Get latest booking ID
    const bookingId = getLatestBookingId();

    if (!bookingId) {
      toast.error(
        "You need to book an appointment before you can leave a review."
      );
      return;
    }

    // Check if user has already reviewed
    if (hasUserReviewed(bookingId)) {
      toast.error("You have already submitted a review for this appointment.");
      return;
    }

    setUserBookingId(bookingId);
    setModalOpen(true);
  };

  const handleBookAppointment = () => {
    // Navigate to booking page with doctor ID
    navigate(`/SearchDoctors/${doctorId}`);
  };

  const handleReviewSubmitted = (newReview: any) => {
    // Add the review to the state
    const reviewToAdd: IReviews = {
      id: Date.now().toString(),
      name: "You", // Or get user's actual name
      avatar: "/user.jpg", // Or get user's actual avatar
      rating: newReview.rating,
      time: "Just now",
      comment: newReview.comment,
    };

    setReviews([reviewToAdd, ...reviews]);

    // Update the average rating (simple calculation)
    if (doctor) {
      const totalReviews = reviews.length + 1;
      const totalRating =
        reviews.reduce((sum, rev) => sum + rev.rating, 0) + newReview.rating;
      const newAverage = totalRating / totalReviews;

      setDoctor({
        ...doctor,
        rating: parseFloat(newAverage.toFixed(1)),
      });
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!doctor) return <div className="p-10 text-center">Doctor not found</div>;

  return (
    <div className="min-h-screen bg-neutral-50 flex justify-center">
      <Box className="w-full max-w-screen-xl bg-white shadow-lg rounded-xl p-8 md:p-12 space-y-10">
        {/* Header */}
        <Box className="flex items-center mb-6">
          <IconButton onClick={() => navigate(-1)} className="mr-4">
            <FaArrowLeft className="text-2xl text-primary-500" />
          </IconButton>
          <Typography variant="h5" className="font-bold text-primary-500">
            Doctor Details
          </Typography>
        </Box>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_2fr] gap-10">
          {/* Left Column */}
          <div className="flex flex-col space-y-8">
            <Box className="flex items-center gap-6">
              <Box className="relative">
                <Avatar
                  src={doctor.image}
                  alt={doctor.name}
                  className="!w-28 !h-28 md:!w-32 md:!h-32 border-2 border-primary-500"
                />
              </Box>

              <Box className="flex flex-col justify-between space-y-1">
                <Box className="flex items-center gap-2">
                  <Typography
                    variant="h4"
                    className="font-bold text-primary-700"
                  >
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
                <Typography variant="subtitle1" className="text-secondary-700">
                  {doctor.specialty}
                </Typography>
                <Typography variant="body2" className="text-neutral-600">
                  {doctor.location.address}
                </Typography>
              </Box>
            </Box>
            {/* Stats */}
            <Box className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 border-b border-neutral-200 pb-6">
              <Box className="flex flex-col items-center text-center space-y-1">
                <FaUserGroup className="text-secondary-500 text-2xl" />
                <Typography className="font-bold text-secondary-700">
                  2,000+
                </Typography>
                <Typography className="text-sm text-neutral-500">
                  patients
                </Typography>
              </Box>
              <Box className="flex flex-col items-center text-center space-y-1">
                <FaBriefcase className="text-secondary-500 text-2xl" />
                <Typography className="font-bold text-secondary-700">
                  10+
                </Typography>
                <Typography className="text-sm text-neutral-500">
                  experience
                </Typography>
              </Box>
              <Box className="flex flex-col items-center text-center space-y-1">
                <FaStar className="text-secondary-500 text-2xl" />
                <Typography className="font-bold text-secondary-700">
                  {doctor.rating}
                </Typography>
                <Typography className="text-sm text-neutral-500">
                  rating
                </Typography>
              </Box>
              <Box className="flex flex-col items-center text-center space-y-1">
                <FaCommentDots className="text-secondary-500 text-2xl" />
                <Typography className="font-bold text-secondary-700">
                  {reviews.length}
                </Typography>
                <Typography className="text-sm text-neutral-500">
                  reviews
                </Typography>
              </Box>
            </Box>

            {/* About */}
            <Box className="space-y-2">
              <AboutSection text={doctor.about} />
            </Box>
          </div>

          {/* Right Column */}
          <div className="flex flex-col space-y-4 md:space-y-8 bg-neutral-50 p-4 md:p-6 lg:p-8 rounded-xl w-full">
            {/* Rating Overview - Mobile optimized */}
            <Box className="space-y-3 md:space-y-2">
              <Typography
                variant="h5"
                className="font-bold text-primary-700 text-lg md:text-xl"
              >
                Reviews and Rating
              </Typography>

              {/* Desktop layout */}
              <Box className="hidden md:flex items-center gap-3">
                <Rating
                  value={doctor.rating}
                  precision={0.5}
                  readOnly
                  size="medium"
                />
                <Typography className="font-bold text-lg text-secondary-700 whitespace-nowrap">
                  {doctor.rating}/5
                </Typography>
                <Typography className="text-secondary-600 whitespace-nowrap">
                  {reviews.length} Reviews
                </Typography>
                <Button
                  startIcon={<FaPencilAlt />}
                  variant="contained"
                  onClick={handleAddReviewClick}
                  className="ml-auto rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm md:text-base"
                  size="medium"
                >
                  Add Review
                </Button>
              </Box>

              {/* Mobile layout */}
              <Box className="md:hidden space-y-3">
                <Box className="flex items-center justify-between">
                  <Box className="flex items-center gap-2">
                    <Rating
                      value={doctor.rating}
                      precision={0.5}
                      readOnly
                      size="small"
                    />
                    <Typography className="font-bold text-base text-secondary-700">
                      {doctor.rating}/5
                    </Typography>
                  </Box>
                  <Typography className="text-secondary-600 text-sm">
                    {reviews.length} Reviews
                  </Typography>
                </Box>

                <Button
                  startIcon={<FaPencilAlt />}
                  variant="contained"
                  onClick={handleAddReviewClick}
                  className="w-full rounded-xl bg-primary-500 hover:bg-primary-600 text-white py-2.5"
                  size="medium"
                >
                  Add Review
                </Button>
              </Box>
            </Box>

            {/* Reviews List */}
            <Box className="space-y-3 md:space-y-4 max-h-80 md:max-h-96 overflow-y-auto pr-1 md:pr-2">
              {reviews.map((rev) => (
                <Box
                  key={rev.id}
                  className="p-3 md:p-4 bg-white rounded-lg shadow-sm space-y-2"
                >
                  <Box className="flex justify-between items-start gap-2">
                    <Box className="flex items-start gap-3 min-w-0 flex-1">
                      <Avatar
                        src={rev.avatar}
                        sx={{
                          width: { xs: 36, sm: 40, md: 44 },
                          height: { xs: 36, sm: 40, md: 44 },
                        }}
                      />
                      <Box className="min-w-0 flex-1">
                        <Typography className="font-bold text-secondary-700 text-sm md:text-base truncate">
                          {rev.name}
                        </Typography>
                        <Typography className="text-xs text-neutral-500">
                          {rev.time}
                        </Typography>
                      </Box>
                    </Box>
                    <Box className="flex items-center gap-1 p-1 md:p-0.5 rounded-md bg-warning-200/50 flex-shrink-0">
                      <FaStar className="text-warning-500 text-sm md:text-base" />
                      <Typography className="font-semibold text-warning-700 text-sm">
                        {rev.rating}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography className="text-neutral-700 text-sm md:text-base line-clamp-2 md:line-clamp-3">
                    {rev.comment}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Booking Section */}
            <Box className="pt-4 space-y-4">
              <Box className="flex justify-between items-baseline">
                <Box className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-2">
                  <Typography
                    variant="h6"
                    className="font-semibold text-secondary-700 text-base md:text-lg"
                  >
                    Price
                  </Typography>
                  <Typography className="text-sm text-neutral-500">
                    / hour
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  className="font-extrabold text-error-500 text-lg md:text-xl"
                >
                  ${doctor.price}
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="large"
                fullWidth
                className="rounded-lg bg-primary-500 hover:bg-primary-600 text-white py-3 md:py-2.5 text-base md:text-base"
                onClick={handleBookAppointment}
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
        bookingId={userBookingId || undefined}
        doctorId={doctorId}
        doctorName={doctor?.name}
        onSubmit={handleReviewSubmitted}
      />
    </div>
  );
};

export default DoctorDetailsPage;
