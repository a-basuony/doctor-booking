import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { useSavedCards } from "../hooks/usePaymentMethods";
import { usePayment } from "../hooks/usePayment";
import { AppointmentSuccessModal } from "../components/payment/AppointmentSuccessModal";
import { AddCardModal } from "../components/payment/AddCardModal";
import SavedCardsList from "../components/payment/SavedCardsList";
import { stripePromise } from "../services/paymentService";
import toast, { Toaster } from "react-hot-toast";

const formatAppointmentDate = (dateString: string): string => {
  const date = new Date(dateString);
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", dateOptions);
};

interface BookingState {
  bookingId?: string | number;
  doctorId?: string;
  doctorName?: string;
  doctorImage?: string | null;
  specialty?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  formattedAppointmentTime?: string;
  startTime?: string;
  endTime?: string;
  sessionPrice?: number;
  clinicAddress?: string;
}

export const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get booking data from navigation state
  const bookingState = location.state as BookingState | null;

  // Call all hooks before any conditional returns (React rules)
  const {
    cards,
    addCard,
    deleteCard,
    setDefaultCard,
    isAdding,
    isDeleting,
    isSettingDefault
  } = useSavedCards();
  const { processPayment, isProcessing } = usePayment();

  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Dismiss any existing toasts when component mounts
  useEffect(() => {
    toast.dismiss();
  }, []);

  // Redirect if no booking data (using useEffect to avoid rendering issues)
  useEffect(() => {
    if (!bookingState || !bookingState.bookingId) {
      toast.error(
        "No booking information found. Please book an appointment first."
      );
      navigate("/SearchDoctors", { replace: true });
    }
  }, [bookingState, navigate]);

  // Return early if no booking data (after hooks are called)
  if (!bookingState || !bookingState.bookingId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  const formattedDate = bookingState.appointmentDate
    ? formatAppointmentDate(bookingState.appointmentDate)
    : "";

  const displayTime =
    bookingState.appointmentTime || bookingState.formattedAppointmentTime || "";

  const appointment = {
    id: bookingState.bookingId.toString(),
    date: formattedDate,
    time: displayTime,
    doctorName: bookingState.doctorName || "Doctor",
  };

  const doctor = {
    name: bookingState.doctorName || "Doctor",
    image: bookingState.doctorImage || "/default-doctor.png",
    specialty: bookingState.specialty || "Specialist",
    location: {
      address: bookingState.clinicAddress || "Clinic Address",
    },
    price: bookingState.sessionPrice || 150,
  };

  const handleAddCard = async (cardData: {
    provider_token: string;
    brand: string;
    last_four: string;
    exp_month: number;
    exp_year: number;
  }) => {
    try {
      // Save card to backend directly
      const newCard = await addCard({
        ...cardData,
        is_default: cards.length === 0, // First card is default
      });

      setSelectedCardId(newCard.id);
      setShowCardModal(false);
    } catch (error) {
      console.error("Failed to add card:", error);
      throw error;
    }
  };

  const handlePayment = async () => {
    if (!bookingState || !bookingState.bookingId) {
      toast.error("Booking information is missing. Cannot proceed.");
      return;
    }

    try {
      // Show loading toast
      const loadingToast = toast.loading("Processing payment...");

      console.log('Processing payment for booking:', bookingState.bookingId);

      // Process payment with the API - just send booking_id and gateway
      // Backend will handle Stripe payment processing
      await processPayment({
        bookingId: bookingState.bookingId.toString(),
      });

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Show success toast with auto-dismiss
      toast.success("Payment successful!", {
        duration: 3000, // Auto dismiss after 3 seconds
      });

      // Show success modal
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Payment error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Payment failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleSuccessDone = () => {
    setShowSuccessModal(false);
    setTimeout(() => {
      navigate("/BookingPage");
    }, 500);
  };

  const isButtonDisabled = isProcessing;

  return (
    <div className="min-h-screen bg-neutral-50 pb-6">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="px-4 py-4 flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-neutral-100 rounded-lg"
            >
              ← Back
            </button>
            <h1 className="text-lg font-semibold">Payment</h1>
          </div>
        </div>

        {/* Doctor Info */}
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border">
            <div className="flex gap-3">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-16 h-16 rounded-xl object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/default-doctor.png";
                }}
              />
              <div className="flex-1">
                <h2 className="font-semibold">{doctor.name}</h2>
                <p className="text-sm text-secondary-600">{doctor.specialty}</p>
                <p className="text-xs text-secondary-500 mt-1">
                  {doctor.location.address}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-primary-50 rounded-xl p-4 flex items-center justify-between border border-primary-100">
            <span className="font-medium text-sm">
              {appointment.date} - {appointment.time}
            </span>
            <button
              onClick={() =>
                navigate(`/SearchDoctors/${bookingState.doctorId}`)
              }
              className="text-primary-600 text-sm font-medium"
            >
              Reschedule
            </button>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border">
            <h3 className="font-semibold mb-3">Payment Method</h3>

            <SavedCardsList
              cards={cards}
              selectedCardId={selectedCardId}
              onSelectCard={setSelectedCardId}
              onDeleteCard={deleteCard}
              onSetDefault={setDefaultCard}
              isDeleting={isDeleting}
              isSettingDefault={isSettingDefault}
            />
            <button
              onClick={() => setShowCardModal(true)}
              className="w-full py-3 mt-3 border-2 border-dashed border-primary-300 rounded-xl text-primary-600 font-medium"
            >
              + Add new card
            </button>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border">
            <div className="flex items-center justify-between mb-6 py-4 border-t">
              <span className="text-secondary-600">Total Price</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-red-500">
                  ${doctor.price}
                </span>
                <span className="text-sm text-secondary-500">/session</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isButtonDisabled}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white py-4 rounded-xl font-semibold text-lg"
            >
              {isProcessing ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </div>
      </div>

      {/* Add Card Modal */}
      {showCardModal && (
        <Elements stripe={stripePromise}>
          <AddCardModal
            onSuccess={handleAddCard}
            onCancel={() => setShowCardModal(false)}
            isLoading={isAdding}
          />
        </Elements>
      )}

      {showSuccessModal && (
        <AppointmentSuccessModal
          doctorName={doctor.name}
          date={appointment.date}
          time={appointment.time}
          onDone={handleSuccessDone}
        />
      )}
    </div>
  );
};
