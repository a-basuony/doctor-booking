import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  ChevronDown,
  Clock,
  MapPin,
  User,
  Loader2,
} from "lucide-react";
import { useMyBookings, useCancelBooking } from "../../hooks/useMyBookings";

// Define proper types
interface DateOption {
  value: string;
  label: string;
}

const Booking = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  // Reschedule Modal State - Removed

  const { data: appointments, isLoading, error } = useMyBookings();
  const cancelBooking = useCancelBooking();

  const availableDates: DateOption[] = [
    { value: "", label: "All" },
    { value: "2024-07-21", label: "Monday, July 21" },
    { value: "2024-07-06", label: "Sunday, July 6" },
    { value: "2024-07-31", label: "Wednesday, July 31" },
  ];

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const filters: string[] = [
    "All",
    "Pending",
    "Rescheduled",
    "Completed",
    "Cancelled",
  ];

  const filteredAppointments =
    appointments?.filter((apt) => {
      const matchesFilter =
        selectedFilter === "All" ||
        apt.status.toLowerCase() === selectedFilter.toLowerCase();
      const matchesDate =
        !selectedDate || apt.appointment_date === selectedDate;
      return matchesFilter && matchesDate;
    }) || [];

  const handleReschedule = (id: number): void => {
    navigate(`/book-appointment/${id}`);
  };

  const handleFeedback = (): void => {
    navigate("/SearchDoctors");
  };

  const handleSupport = (): void => {
    navigate("/contact");
  };

  const handleViewDetails = (): void => {
    navigate("/doctor-details");
  };

  const handleBookAgain = (id: number): void => {
    navigate(`/book-appointment/${id}`);
  };

  const handleCancel = (id: number): void => {
    cancelBooking.mutate(id);
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "pending":
      case "upcoming":
        return "text-blue-600";
      case "completed":
        return "text-green-600";
      case "canceled":
      case "cancelled":
        return "text-red-600";
      case "rescheduled":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        Error loading appointments. Please try again later.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6">Your appointments</h1>

        {/* Filter buttons and date selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex gap-2 flex-wrap">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  selectedFilter === filter
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center gap-2 border rounded-lg px-4 py-2 bg-white hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium flex-1 text-left">
                {availableDates.find((d) => d.value === selectedDate)?.label ||
                  "Select Date"}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {showDatePicker && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDatePicker(false)}
                />
                <div className="absolute top-full mt-2 right-0 bg-white border rounded-md shadow-lg z-20 min-w-[250px]">
                  {availableDates.map((date) => (
                    <button
                      key={date.value}
                      onClick={() => {
                        setSelectedDate(date.value);
                        setShowDatePicker(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm ${
                        selectedDate === date.value
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : ""
                      }`}
                    >
                      {date.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Appointments grid */}
        {filteredAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(appointment.appointment_date)}</span>
                  </div>
                  <span
                    className={`text-sm font-medium ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1)}
                  </span>
                </div>

                {/* Doctor info */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                    {appointment.doctor.image ? (
                      <img
                        src={appointment.doctor.image}
                        alt={appointment.doctor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {appointment.doctor.name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {appointment.doctor.speciality}
                    </p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Clock className="w-4 h-4" />
                  <span>{appointment.appointment_time}</span>
                </div>

                {/* Address */}
                <div className="flex items-start gap-2 text-sm text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">
                    {appointment.doctor.address}
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  {(appointment.status === "pending" ||
                    appointment.status === "rescheduled" ||
                    appointment.status === "upcoming") && (
                    <>
                      <button
                        onClick={() => handleCancel(appointment.id)}
                        disabled={cancelBooking.isPending}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancelBooking.isPending ? "Cancelling..." : "Cancel"}
                      </button>
                      <button
                        onClick={() => handleReschedule(appointment.id)}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Reschedule
                      </button>
                    </>
                  )}

                  {appointment.status === "completed" && (
                    <>
                      <button
                        onClick={() => handleViewDetails()}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleFeedback()}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Feedback
                      </button>
                    </>
                  )}

                  {(appointment.status === "canceled" ||
                    appointment.status === "cancelled") && (
                    <>
                      <button
                        onClick={() => handleBookAgain(appointment.id)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Book again
                      </button>
                      <button
                        onClick={() => handleSupport()}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Support
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg">
              No appointments found for the selected filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
