import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Avatar,
  IconButton,
  Rating,
  CircularProgress,
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
import { useToggleFavorite } from "../hooks/useFavorites";

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
  is_favorite?: boolean;
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

// Interface for API review response based on your example
interface ApiReviewResponse {
  success: boolean;
  doctor: {
    id: number;
    name: string;
    average_rating: number;
  };
  data: Array<{
    id: number;
    rating: number;
    comment: string;
    doctor_response: string | null;
    created_at: string; // "1 day ago"
    responded_at: string | null;
    patient: {
      id: number;
      name: string;
      photo: string | null;
    };
  }>;
}

const DoctorDetailsPage = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<DoctorDetails | null>(null);
  const [reviews, setReviews] = useState<IReviews[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userBookingId, setUserBookingId] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);

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

  // Get avatar URL
  const getAvatarUrl = (patient: { id: number; photo: string | null }) => {
    if (patient.photo) {
      return `https://round8-backend-team-one.huma-volve.com/storage/${patient.photo}`;
    }
    // Fallback to random avatar based on patient ID
    return `https://picsum.photos/100/100?random=${patient.id}`;
  };

  // Fetch doctor details
  const fetchDoctorDetails = async () => {
    if (!doctorId) return;

    try {
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
          rating: averageRating || 4.5, // Will be updated after fetching reviews
          price: apiDoctor.session_price,
          about: apiDoctor.bio || "Experienced doctor with years of practice.",
          location: {
            address: apiDoctor.clinic_address || "Cairo, Egypt",
          },
        };

        setDoctor(doctorDetails);

        // Get latest booking ID for this doctor
        const bookingId = getLatestBookingId();
        setUserBookingId(bookingId);
      }
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      toast.error("Failed to load doctor details");
    }
  };

  // Fetch reviews for this doctor
  const fetchReviews = async () => {
    if (!doctorId) return;

    setLoadingReviews(true);
    try {
      const response = await api.get<ApiReviewResponse>(
        `/reviews/doctor/${doctorId}`
      );

      if (response.data.success) {
        const { doctor: doctorInfo, data: apiReviews } = response.data;

        // Update average rating from API
        if (doctorInfo.average_rating) {
          setAverageRating(doctorInfo.average_rating);
        }

        // Transform API reviews to match IReviews interface
        const processedReviews: IReviews[] = apiReviews.map((review) => ({
          id: review.id.toString(),
          name: review.patient.name || "Anonymous",
          avatar: getAvatarUrl(review.patient),
          time: review.created_at, // Already formatted as "1 day ago"
          rating: review.rating,
          comment: review.comment,
          doctorResponse: review.doctor_response || undefined,
        }));

        setReviews(processedReviews);
        setTotalReviews(processedReviews.length);

        // Update doctor rating with API average if available
        if (doctorInfo.average_rating > 0 && doctor) {
          setDoctor({
            ...doctor,
            rating: doctorInfo.average_rating,
          });
        }
      } else {
        toast.error("Failed to load reviews");
        // Fallback to mock reviews
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
      }
    } catch (error: any) {
      console.error("Error fetching reviews:", error);

      // Check if it's a 404 error (no reviews yet)
      if (error.response?.status === 404) {
        // No reviews yet - show empty state
        setReviews([]);
        setTotalReviews(0);
      } else {
        toast.error("Unable to load reviews. Please try again later.");
        // Fallback to mock reviews
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
      }
    } finally {
      setLoadingReviews(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchDoctorDetails();
      await fetchReviews();
      setLoading(false);
    };

    fetchData();
  }, [doctorId]);

  // Refresh reviews after submitting a new one
  const handleReviewSubmitted = async () => {
    toast.success("Review submitted successfully!");
    // Refresh reviews to show the new one
    await fetchReviews();
    // Refresh doctor details to update average rating
    await fetchDoctorDetails();
  };

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
                  {averageRating > 0
                    ? averageRating.toFixed(1)
                    : doctor.rating.toFixed(1)}
                </Typography>
                <Typography className="text-sm text-neutral-500">
                  rating
                </Typography>
              </Box>
              <Box className="flex flex-col items-center text-center space-y-1">
                <FaCommentDots className="text-secondary-500 text-2xl" />
                <Typography className="font-bold text-secondary-700">
                  {totalReviews > 0 ? totalReviews : reviews.length}
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
                  value={averageRating > 0 ? averageRating : doctor.rating}
                  precision={0.5}
                  readOnly
                  size="medium"
                />
                <Typography className="font-bold text-lg text-secondary-700 whitespace-nowrap">
                  {(averageRating > 0 ? averageRating : doctor.rating).toFixed(
                    1
                  )}
                  /5
                </Typography>
                <Typography className="text-secondary-600 whitespace-nowrap">
                  {totalReviews > 0 ? totalReviews : reviews.length} Reviews
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
                      value={averageRating > 0 ? averageRating : doctor.rating}
                      precision={0.5}
                      readOnly
                      size="small"
                    />
                    <Typography className="font-bold text-base text-secondary-700">
                      {(averageRating > 0
                        ? averageRating
                        : doctor.rating
                      ).toFixed(1)}
                      /5
                    </Typography>
                  </Box>
                  <Typography className="text-secondary-600 text-sm">
                    {totalReviews > 0 ? totalReviews : reviews.length} Reviews
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
              {loadingReviews ? (
                <Box className="flex justify-center py-8">
                  <CircularProgress size={32} />
                </Box>
              ) : reviews.length === 0 ? (
                <Box className="text-center py-8">
                  <Typography className="text-gray-500 mb-2">
                    No reviews yet
                  </Typography>
                  <Typography className="text-gray-400 text-sm">
                    Be the first to review this doctor!
                  </Typography>
                </Box>
              ) : (
                reviews.map((rev) => (
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
                          {rev.rating.toFixed(1)}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography className="text-neutral-700 text-sm md:text-base line-clamp-2 md:line-clamp-3">
                      {rev.comment}
                    </Typography>

                    {/* Doctor Response */}
                    {rev.doctorResponse && (
                      <Box className="mt-3 pt-3 border-t border-gray-100">
                        <Box className="flex items-start gap-2">
                          <FaStar
                            className="text-blue-500 mt-1 flex-shrink-0"
                            size={14}
                          />
                          <Box className="min-w-0">
                            <Typography className="text-xs font-semibold text-blue-800 mb-1">
                              Doctor's Response
                            </Typography>
                            <Typography className="text-neutral-600 text-xs line-clamp-2">
                              {rev.doctorResponse}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    )}
                  </Box>
                ))
              )}
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
