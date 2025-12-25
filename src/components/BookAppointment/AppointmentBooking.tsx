import "react-datepicker/dist/react-datepicker.css";

import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { FadeIn } from "./FadeIn";
import BasicDateCalendar from "./CalendarDropdown";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export interface DateSlot {
  day: string; // e.g., "Mon"
  date: number; // e.g., 15
  fullDate: Date;
}

export interface TimeSlot {
  id: string;
  time: string;
}

const TIME_SLOTS: TimeSlot[] = [
  { id: "1", time: "9:00 AM" },
  { id: "2", time: "10:00 AM" },
  { id: "3", time: "11:00 AM" },
  { id: "4", time: "12:30 AM" },
  { id: "5", time: "5:30 PM" },
  { id: "6", time: "7:00 PM" },
  { id: "7", time: "9:00 PM" },
  { id: "8", time: "10:00 PM" },
];

interface AppointmentBookingProps {
  doctorId?: string;
  sessionPrice?: number;
  doctorName?: string;
  onBookAppointment: (bookingData: {
    appointmentDate: Date;
    appointmentTime: string;
    startTime: string;
    endTime: string;
    paymentMethod?: string;
    notes?: string;
  }) => void;
}

export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  doctorId,
  sessionPrice = 150,
  doctorName = "doctor",
  onBookAppointment,
}) => {
  const navigate = useNavigate();
  const [isBooking, setIsBooking] = useState(false);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());

  // Generate dates starting from selected calendar date
  const generateDates = (): DateSlot[] => {
    const dates: DateSlot[] = [];
    const startDate = new Date(calendarDate);

    for (let i = 0; i < 14; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      dates.push({
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
        date: d.getDate(),
        fullDate: d,
      });
    }
    return dates;
  };

  const dates = generateDates();
  const [selectedDate, setSelectedDate] = useState<number>(
    dates[0]?.date || 15
  );
  const [selectedTime, setSelectedTime] = useState<string>("11:00 AM");

  const selectedDateObj = dates.find((d) => d.date === selectedDate);

  // Update dates when calendarDate changes
  useEffect(() => {
    const newDates = generateDates();
    const firstDate = newDates[0]?.date;
    if (firstDate && firstDate !== selectedDate) {
      setSelectedDate(firstDate);
    }
  }, [calendarDate]);

  // Format month name
  const getMonthName = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long" });
  };

  const formattedDateString = selectedDateObj
    ? `${
        selectedDateObj.day === "Thu"
          ? "Thursday"
          : selectedDateObj.day === "Tue"
          ? "Tuesday"
          : selectedDateObj.day + "day"
      }, ${getMonthName(
        selectedDateObj.fullDate
      )} ${selectedDate} - ${selectedTime}`
    : "";

  // Convert 12-hour format to 24-hour format
  const convertTo24Hour = (time12h: string): string => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");

    if (hours === "12") {
      hours = modifier === "AM" ? "00" : "12";
    } else {
      hours = modifier === "PM" ? String(parseInt(hours, 10) + 12) : hours.padStart(2, "0");
    }

    return `${hours}:${minutes}`;
  };

  // Calculate end time (1 hour after start time)
  const calculateEndTime = (startTime: string): string => {
    const [hours, minutes] = startTime.split(":");
    const endHour = (parseInt(hours, 10) + 1).toString().padStart(2, "0");
    return `${endHour}:${minutes}`;
  };

  // Handle booking
  const handleBooking = async () => {
    if (!selectedDateObj) {
      toast.error("Please select a date");
      return;
    }

    if (!selectedTime) {
      toast.error("Please select a time");
      return;
    }

    if (!doctorId) {
      toast.error("Doctor information is missing");
      return;
    }

    setIsBooking(true);
    try {
      const startTime24h = convertTo24Hour(selectedTime);
      const endTime24h = calculateEndTime(startTime24h);

      await onBookAppointment({
        appointmentDate: selectedDateObj.fullDate,
        appointmentTime: selectedTime,
        startTime: startTime24h,
        endTime: endTime24h,
        paymentMethod: "stripe",
        notes: `Appointment with ${doctorName}`,
      });
      navigate("/BookingPage");
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to book appointment. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
      <FadeIn>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-gray-500 text-sm font-semibold sm:text-lg sm:font-medium">
            Choose date and time
          </h2>
          <div className="flex items-center gap-2 text-gray-800 font-semibold cursor-pointer">
            <BasicDateCalendar onDateChange={setCalendarDate} />
          </div>
        </div>

        {/* Date Scroller */}
        <div className="relative mb-8">
          <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
            {dates.map((slot) => {
              const isSelected = slot.date === selectedDate;
              return (
                <button
                  key={slot.date}
                  onClick={() => setSelectedDate(slot.date)}
                  className={`flex flex-col items-center justify-center min-w-[70px] h-[80px] rounded-2xl transition-all duration-300 ${
                    isSelected
                      ? "bg-blue-700 text-white shadow-lg shadow-blue-200 scale-105"
                      : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                  }`}
                >
                  <span
                    className={`text-sm mb-1 ${
                      isSelected ? "font-medium" : ""
                    }`}
                  >
                    {slot.day}
                  </span>
                  <span
                    className={`text-xl ${
                      isSelected ? "font-bold" : "font-semibold"
                    }`}
                  >
                    {slot.date}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Slots */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {TIME_SLOTS.map((slot) => {
            const isSelected = slot.time === selectedTime;
            return (
              <button
                key={slot.id}
                onClick={() => setSelectedTime(slot.time)}
                className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? "bg-blue-700 text-white shadow-md"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              >
                {slot.time}
              </button>
            );
          })}
        </div>

        {/* Price and Action */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-100 pt-6">
          <div className="flex items-center gap-6 mb-4 md:mb-0">
            <div className="flex items-center gap-2 text-slate-700">
              <div className="bg-blue-50 p-2 rounded-full text-blue-600">
                <Calendar size={18} />
              </div>
              <span className="font-medium">{formattedDateString}</span>
            </div>

            <div className="text-lg font-bold text-slate-800">
              ${sessionPrice}
              <span className="text-sm font-normal text-gray-500 ml-1">
                /session
              </span>
            </div>
          </div>

          <button
            onClick={handleBooking}
            disabled={isBooking || !selectedDateObj || !selectedTime}
            className={`no-underline text-center w-96 md:w-auto px-10 py-3 sm:py-4 cursor-pointer rounded-xl border font-semibold transition-colors ${
              isBooking || !selectedDateObj || !selectedTime
                ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                : "bg-transparent border-blue-600 text-blue-600 hover:bg-blue-50"
            }`}
          >
            {isBooking ? "Booking..." : "Book"}
          </button>
        </div>
      </FadeIn>
    </div>
  );
};
