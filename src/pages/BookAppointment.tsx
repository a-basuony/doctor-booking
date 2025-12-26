import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { FadeIn } from "./../components/BookAppointment/FadeIn";
import { AddReviewModal } from "./../components/BookAppointment/AddReviewModal";
import { ReviewsSection } from "./../components/BookAppointment/ReviewsSection";
import { DoctorProfile } from "./../components/BookAppointment/DoctorProfile";
import { AppointmentBooking } from "./../components/BookAppointment/AppointmentBooking";
import { useNavigate, useParams, useLocation } from "react-router-dom"; // Added useLocation
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

export default function BookAppointment() {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [doctor, setDoctor] = useState<ApiDoctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [_error, _setError] = useState<string | null>(null);
  const [userBookingId, setUserBookingId] = useState<string | null>(null);

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

  // Function to handle booking and navigate to payment
  // In BookAppointment parent component, update handleBooking:

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
        doctor_id: doctorId.toString(), // Ensure it's a string
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

      if (response.data.success) {
        // Store booking ID for review submission
        if (response.data.data?.id) {
          const bookingId = response.data.data.id.toString();
          setUserBookingId(bookingId);

          // Save to localStorage for persistence
          localStorage.setItem(`doctor_${doctorId}_booking_id`, bookingId);

          // Also store in sessionStorage for immediate use
          sessionStorage.setItem(`current_booking_id`, bookingId);

          // Store booking info for review
          localStorage.setItem(
            `booking_${bookingId}_info`,
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
            bookingId: response.data.data?.id,
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

  // Error state
  // if (error || !doctor) {
  //   return (
  //     <div className="min-h-screen py-4 md:py-8 lg:py-12 max-w-7xl mx-auto font-sans">
  //       <header className="mb-8">
  //         <button className="bg-transparent cursor-pointer flex items-center gap-1 text-slate-800 hover:text-blue-600 transition-colors group">
  //           <div
  //             className="p-2 rounded-full transition-colors"
  //             onClick={() => navigate("/SearchDoctors")}
  //           >
  //             <ArrowLeft size={20} />
  //           </div>
  //           <h1 className="text-[18px] md:text-2xl font-serif font-medium">
  //             Make an appointment
  //           </h1>
  //         </button>
  //       </header>

  //       <div className="flex items-center justify-center py-12">
  //         <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md w-full text-center">
  //           <h3 className="text-lg font-semibold text-red-800 mb-2">
  //             Unable to Load Doctor Details
  //           </h3>
  //           <p className="text-red-600 mb-4">{error || "Doctor not found"}</p>
  //           <button
  //             onClick={() => navigate("/SearchDoctors")}
  //             className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
  //           >
  //             Back to Doctors List
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen py-4 md:py-8 lg:py-12 max-w-7xl mx-auto font-sans">
      <AddReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        doctorId={doctorId}
        bookingId={latestBookingId} // Make sure this is not null/undefined
        doctorName={doctor?.name}
        onReviewSubmitted={() => {
          console.log("Review submitted successfully");
          // You might want to refresh the reviews here
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
            onAddReview={() => {
              // Check if user has a booking before allowing review
              // if (!latestBookingId) {
              //   // Show a message that they need to book first
              //   alert(
              //     "You need to book an appointment before you can leave a review."
              //   );
              //   return;
              // }
              setIsReviewModalOpen(true);
            }}
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
