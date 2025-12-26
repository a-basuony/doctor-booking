import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { FadeIn } from "./../components/BookAppointment/FadeIn";
import { AddReviewModal } from "./../components/BookAppointment/AddReviewModal";
import { ReviewsSection } from "./../components/BookAppointment/ReviewsSection";
import { DoctorProfile } from "./../components/BookAppointment/DoctorProfile";
import { AppointmentBooking } from "./../components/BookAppointment/AppointmentBooking";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { api } from "../services/api";
import toast from "react-hot-toast";

// Interface for API response
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

// Interface for booking request
interface BookingRequest {
  doctor_id: string;
  appointment_date: string; // YYYY-MM-DD format
  appointment_time: string; // HH:MM format (24-hour)
  payment_method: string;
  notes?: string;
}

interface BookingData {
  id: number | string;
  [key: string]: unknown;
}

interface BookingResponse {
  success: boolean;
  message: string;
  data?: BookingData;
  id?: number | string;
  [key: string]: unknown;
}

// Interface for booking status
interface BookingStatus {
  id: number | string;
  status: string;
  appointment_date: string;
  appointment_time: string;
  [key: string]: unknown;
}

export default function BookAppointment() {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [doctor, setDoctor] = useState<ApiDoctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [_error, _setError] = useState<string | null>(null);
  const [userBookingId, setUserBookingId] = useState<string | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  const navigate = useNavigate();
  const { doctorId } = useParams();
  const location = useLocation();

  // Get bookingId from location state if available
  const locationBookingId = location.state?.bookingId;

  // Initialize userBookingId from localStorage after doctorId is available
  useEffect(() => {
    if (doctorId) {
      const storedBookingId = localStorage.getItem(
        `doctor_${doctorId}_booking_id`
      );
      if (storedBookingId) {
        setUserBookingId(storedBookingId);
      }
    }
  }, [doctorId]);

  // Function to get latest booking ID (checks multiple sources)
  const getLatestBookingId = () => {
    // Check location state first (most recent)
    if (locationBookingId) return locationBookingId;

    // Check userBookingId state
    if (userBookingId) return userBookingId;

    // Check localStorage for doctor-specific booking
    if (doctorId) {
      const doctorBookingId = localStorage.getItem(
        `doctor_${doctorId}_booking_id`
      );
      if (doctorBookingId) return doctorBookingId;
    }

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

  // Get the latest booking ID for review modal
  const latestBookingId = getLatestBookingId();

  // Function to check appointment status
  const checkAppointmentStatus = async (bookingId: string) => {
    try {
      const response = await api.get<{
        success: boolean;
        message: string;
        data?: BookingStatus;
      }>(`/bookings/${bookingId}`);

      if (response.data.success && response.data.data) {
        const status = response.data.data.status;
        const validStatuses = ["completed", "finished", "done", "closed"];
        return validStatuses.includes(status.toLowerCase());
      }
      return false;
    } catch (err) {
      console.error("Error checking appointment status:", err);
      return false;
    }
  };

  // Function to check if user has already reviewed
  const hasUserReviewed = (bookingId: string) => {
    return localStorage.getItem(`review_submitted_${bookingId}`) === "true";
  };

  // Handle the "Add Review" button click
  const handleAddReviewClick = async () => {
    if (!latestBookingId) {
      toast.error(
        "You need to book an appointment before you can leave a review."
      );
      return;
    }

    // Check if already reviewed
    if (hasUserReviewed(latestBookingId)) {
      toast.error("You have already submitted a review for this appointment.");
      return;
    }

    setIsCheckingStatus(true);
    try {
      const isCompleted = await checkAppointmentStatus(latestBookingId);

      if (!isCompleted) {
        toast.error(
          "You can only submit a review after your appointment session is completed. Please wait until your session is finished."
        );
        return;
      }

      // Open the review modal
      setIsReviewModalOpen(true);
    } catch (err) {
      console.error("Error checking appointment:", err);
      toast.error("Unable to verify appointment status. Please try again.");
    } finally {
      setIsCheckingStatus(false);
    }
  };

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!doctorId) {
        _setError("Doctor ID is missing");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      _setError(null);

      try {
        const response = await api.get<{
          success: boolean;
          message: string;
          data: ApiDoctor;
        }>(`/doctors/${doctorId}`);

        if (response.data.success && response.data.data) {
          setDoctor(response.data.data);
        } else {
          _setError("Failed to load doctor details");
        }
      } catch (err) {
        console.error("Error fetching doctor:", err);
        _setError("Unable to load doctor details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  const handleBooking = async (bookingData: {
    appointmentDate: Date;
    appointmentTime: string;
    startTime: string;
    endTime: string;
    paymentMethod?: string;
    notes?: string;
  }) => {
    if (!doctorId) {
      _setError("Doctor ID is missing");
      toast.error("Doctor information is missing");
      return;
    }

    try {
      // Format date to YYYY-MM-DD
      const formattedDate = bookingData.appointmentDate
        .toISOString()
        .split("T")[0];

      // Validate and format time
      const formattedTime = bookingData.startTime;

      console.log("Time validation - startTime:", bookingData.startTime);
      console.log(
        "Time validation - appointmentTime:",
        bookingData.appointmentTime
      );

      if (!formattedTime || !formattedTime.match(/^\d{2}:\d{2}$/)) {
        console.error("Invalid time format:", formattedTime);
        toast.error(
          `Invalid time format: ${formattedTime}. Please select a valid time slot.`
        );
        return;
      }

      // Construct booking request
      const bookingRequest: BookingRequest = {
        doctor_id: doctorId.toString(),
        appointment_date: formattedDate,
        appointment_time: formattedTime,
        payment_method: bookingData.paymentMethod || "stripe",
        notes:
          bookingData.notes ||
          `Appointment with ${doctor?.name || "doctor"} at ${
            bookingData.appointmentTime
          }`,
      };

      console.log("Making API call with:", bookingRequest);

      const response = await api.post<{
        success: boolean;
        message: string;
        data?: any;
      }>("/bookings", bookingRequest);

      console.log("API Response:", response.data);

      // Check if the response indicates success
      const isSuccess =
        response.data.success !== false &&
        (response.status === 200 || response.status === 201);

      if (
        isSuccess &&
        (response.data.data || (response.data as BookingResponse).id)
      ) {
        // Get booking data - handle different response structures
        const bookingData =
          response.data.data || (response.data as BookingResponse);
        const bookingId = bookingData?.id;

        // Store booking ID for review submission
        if (bookingId) {
          const bookingIdStr = bookingId.toString();
          setUserBookingId(bookingIdStr);

          // Save to localStorage for persistence
          localStorage.setItem(`doctor_${doctorId}_booking_id`, bookingIdStr);

          // Also store in sessionStorage for immediate use
          sessionStorage.setItem(`current_booking_id`, bookingIdStr);

          // Store booking info for review
          localStorage.setItem(
            `booking_${bookingIdStr}_info`,
            JSON.stringify({
              doctorId,
              doctorName: doctor?.name,
              appointmentDate: formattedDate,
              appointmentTime: bookingData.appointmentTime,
            })
          );
        }

        // Show success toast
        toast.success("Appointment booked successfully!");

        // Navigate to payment page with booking details
        navigate("/payment", {
          state: {
            bookingId: bookingData?.id,
            doctorId: doctorId,
            doctorName: doctor?.name,
            doctorImage: doctor?.profile_photo
              ? `https://round8-backend-team-one.huma-volve.com/storage/${doctor.profile_photo}`
              : null,
            specialty: doctor?.specialty?.name,
            appointmentDate: formattedDate,
            appointmentTime: bookingData.appointmentTime,
            formattedAppointmentTime: formattedTime,
            startTime: bookingData.startTime,
            endTime: bookingData.endTime,
            sessionPrice: doctor?.session_price || 150,
            clinicAddress: doctor?.clinic_address,
          },
        });
      } else {
        const errorMsg = response.data.message || "Failed to create booking";
        _setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err: any) {
      console.error("Full error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers,
      });
      // Enhanced error logging
      if (err.response) {
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
        console.error("Error response headers:", err.response.headers);
      }

      let errorMessage = "Unable to create booking. Please try again.";

      if (err.response) {
        if (err.response.status === 409) {
          errorMessage =
            "This time slot is no longer available. Please select another time.";
        } else if (err.response.status === 400) {
          // Show more specific error message
          if (err.response.data?.errors) {
            errorMessage = Object.values(err.response.data.errors)
              .flat()
              .join(", ");
          } else if (err.response.data?.message) {
            errorMessage = err.response.data.message;
          } else {
            errorMessage =
              "Invalid booking data. Please check all fields and try again.";
          }
        } else if (err.response.status === 401) {
          errorMessage = "Please login to book an appointment";
          navigate("/login");
        } else if (err.response.status === 422) {
          errorMessage = "Validation error. Please check your input.";
        } else {
          errorMessage = err.response.data?.message || errorMessage;
        }
      }

      _setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen py-4 md:py-8 lg:py-12 max-w-7xl mx-auto font-sans">
        <header className="mb-8">
          <button className="bg-transparent cursor-pointer flex items-center gap-1 text-slate-800 hover:text-blue-600 transition-colors group">
            <div
              className="p-2 rounded-full transition-colors"
              onClick={() => navigate("/SearchDoctors")}
            >
              <ArrowLeft size={20} />
            </div>
            <h1 className="text-[18px] md:text-2xl font-serif font-medium">
              Make an appointment
            </h1>
          </button>
        </header>

        <div className="flex items-start flex-col px-3 gap-8 lg:flex-row">
          {/* Loading skeleton */}
          <main className="w-full lg:w-2/3 flex-1 px-5">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="flex space-x-3 overflow-x-auto pb-2 mb-8">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className="min-w-[70px] h-[80px] bg-gray-200 rounded-2xl"
                  ></div>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded-xl"></div>
                ))}
              </div>
            </div>
          </main>

          <aside className="w-full lg:w-1/3 relative px-5">
            <div className="bg-gray-200/30 rounded-3xl p-6 shadow-xl shadow-slate-100 animate-pulse">
              <div className="flex justify-between mb-4">
                <div className="w-11 h-11 bg-gray-300 rounded-full"></div>
                <div className="w-11 h-11 bg-gray-300 rounded-full"></div>
              </div>
              <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 bg-gray-300 rounded-full mb-4"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 md:py-8 lg:py-12 max-w-7xl mx-auto font-sans">
      <AddReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        doctorId={doctorId}
        bookingId={latestBookingId}
        doctorName={doctor?.name}
        onReviewSubmitted={() => {
          console.log("Review submitted successfully");
          // You might want to refresh the reviews here
          // You could add a callback to refresh the reviews section
        }}
      />
      <header className="mb-8">
        <FadeIn>
          <button className="bg-transparent cursor-pointer flex items-center gap-1 text-slate-800 hover:text-blue-600 transition-colors group">
            <div
              className="p-2 rounded-full transition-colors"
              onClick={() => navigate("/SearchDoctors")}
            >
              <ArrowLeft size={20} />
            </div>
            <h1 className="text-[18px] md:text-2xl font-serif font-medium">
              Make an appointment with {doctor?.name}
            </h1>
          </button>
        </FadeIn>
      </header>

      {doctor && (
        <div className="flex items-start flex-col px-3 gap-8 lg:flex-row">
          {/* Left Column: Calendar & Reviews */}
          <main className="w-full lg:w-2/3 flex-1 px-5">
            <AppointmentBooking
              doctorId={doctorId}
              sessionPrice={doctor.session_price}
              doctorName={doctor.name}
              onBookAppointment={handleBooking}
            />
            <ReviewsSection
              doctorId={doctorId}
              onAddReview={handleAddReviewClick}
              isChecking={isCheckingStatus}
            />
          </main>
          {/* Right Column: Profile Sidebar */}
          <aside className="w-full lg:w-1/3 relative px-5">
            <DoctorProfile doctor={doctor} />
          </aside>
        </div>
      )}
    </div>
  );
}
