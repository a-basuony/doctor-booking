import "react-datepicker/dist/react-datepicker.css";

import React, { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";
import { FadeIn } from "./FadeIn";
import BasicDateCalendar from "./CalendarDropdown";
import { toast } from "react-hot-toast";
import { api } from "../../services/api";

// Interface for API response
export interface AvailabilitySlot {
  date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  day_name: string;
}

// Interface for UI date slot
export interface DateSlot {
  day: string; // e.g., "Mon"
  date: number; // e.g., 15
  fullDate: Date;
  dateString: string; // YYYY-MM-DD format
  dayName: string; // Full day name
  hasAvailability: boolean;
}

// Interface for UI time slot
export interface TimeSlot {
  id: string;
  time: string; // 12-hour format for display
  startTime: string; // 24-hour format (HH:MM)
  endTime: string; // 24-hour format (HH:MM)
  formattedTime: string; // 12-hour format for display
  timeRange: string; // Display range (e.g., "9:00 AM - 9:30 AM")
}

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
  onBookAppointment, // You can keep this or remove it if doing direct booking
}) => {
  const [isBooking, setIsBooking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [availabilitySlots, setAvailabilitySlots] = useState<
    AvailabilitySlot[]
  >([]);
  const [dates, setDates] = useState<DateSlot[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Convert 24-hour time to 12-hour format
  const convertTo12Hour = (time24: string): string => {
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Format time range for display
  const formatTimeRange = (startTime: string, endTime: string): string => {
    const start12h = convertTo12Hour(startTime);
    const end12h = convertTo12Hour(endTime);
    return `${start12h} - ${end12h}`;
  };

  // Generate dates from availability data
  const generateDatesFromAvailability = (
    slots: AvailabilitySlot[]
  ): DateSlot[] => {
    const uniqueDates = new Set(slots.map((slot) => slot.date));
    const dateSlots: DateSlot[] = [];

    uniqueDates.forEach((dateStr) => {
      const date = new Date(dateStr);
      const slotsForDate = slots.filter((s) => s.date === dateStr);

      dateSlots.push({
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        date: date.getDate(),
        fullDate: date,
        dateString: dateStr,
        dayName: date.toLocaleDateString("en-US", { weekday: "long" }),
        hasAvailability: slotsForDate.length > 0,
      });
    });

    // Sort dates ascending
    return dateSlots.sort(
      (a, b) => a.fullDate.getTime() - b.fullDate.getTime()
    );
  };

  // Generate time slots for selected date
  const generateTimeSlotsForDate = (dateStr: string): TimeSlot[] => {
    const slotsForDate = availabilitySlots.filter(
      (slot) => slot.date === dateStr
    );

    return slotsForDate.map((slot, index) => {
      const formattedTime = convertTo12Hour(slot.start_time);
      return {
        id: `${dateStr}-${slot.start_time}-${index}`,
        time: formattedTime,
        startTime: slot.start_time,
        endTime: slot.end_time,
        formattedTime: formattedTime,
        timeRange: formatTimeRange(slot.start_time, slot.end_time),
      };
    });
  };

  // Fetch availability data
  const fetchAvailability = async () => {
    if (!doctorId) {
      toast.error("Doctor ID is missing");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.get<{
        success: boolean;
        message: string;
        data: AvailabilitySlot[];
      }>(`/doctors/${doctorId}/availability`);

      if (response.data.success && response.data.data) {
        setAvailabilitySlots(response.data.data);

        // Generate dates from availability
        const generatedDates = generateDatesFromAvailability(
          response.data.data
        );
        setDates(generatedDates);

        // Select first available date by default
        if (generatedDates.length > 0) {
          const firstDate = generatedDates[0];
          setSelectedDate(firstDate.dateString);

          // Generate time slots for selected date
          const timeSlotsForDate = generateTimeSlotsForDate(
            firstDate.dateString
          );
          setTimeSlots(timeSlotsForDate);

          // Select first available time slot by default
          if (timeSlotsForDate.length > 0) {
            setSelectedTime(timeSlotsForDate[0].time);
          }

          // Set calendar date to first available date
          setCalendarDate(firstDate.fullDate);
        }
      } else {
        toast.error("Failed to load availability");
        generateFallbackDates();
      }
    } catch (err) {
      console.error("Error fetching availability:", err);
      toast.error("Unable to load doctor availability");
      generateFallbackDates();
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback function when API fails
  const generateFallbackDates = () => {
    const fallbackDates: DateSlot[] = [];
    const startDate = new Date();

    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];

      fallbackDates.push({
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
        date: d.getDate(),
        fullDate: d,
        dateString: dateStr,
        dayName: d.toLocaleDateString("en-US", { weekday: "long" }),
        hasAvailability: i < 5, // Mock: first 5 days have availability
      });
    }

    setDates(fallbackDates);

    if (fallbackDates.length > 0) {
      const firstDate = fallbackDates[0];
      setSelectedDate(firstDate.dateString);

      // Generate fallback time slots
      const fallbackTimeSlots: TimeSlot[] = [
        {
          id: "1",
          time: "9:00 AM",
          startTime: "09:00",
          endTime: "09:30",
          formattedTime: "9:00 AM",
          timeRange: "9:00 AM - 9:30 AM",
        },
        {
          id: "2",
          time: "10:00 AM",
          startTime: "10:00",
          endTime: "10:30",
          formattedTime: "10:00 AM",
          timeRange: "10:00 AM - 10:30 AM",
        },
        {
          id: "3",
          time: "11:00 AM",
          startTime: "11:00",
          endTime: "11:30",
          formattedTime: "11:00 AM",
          timeRange: "11:00 AM - 11:30 AM",
        },
        {
          id: "4",
          time: "2:00 PM",
          startTime: "14:00",
          endTime: "14:30",
          formattedTime: "2:00 PM",
          timeRange: "2:00 PM - 2:30 PM",
        },
        {
          id: "5",
          time: "3:00 PM",
          startTime: "15:00",
          endTime: "15:30",
          formattedTime: "3:00 PM",
          timeRange: "3:00 PM - 3:30 PM",
        },
        {
          id: "6",
          time: "4:00 PM",
          startTime: "16:00",
          endTime: "16:30",
          formattedTime: "4:00 PM",
          timeRange: "4:00 PM - 4:30 PM",
        },
      ];
      setTimeSlots(fallbackTimeSlots);
      setSelectedTime(fallbackTimeSlots[0].time);
      setCalendarDate(firstDate.fullDate);
    }
  };

  // Load availability when doctorId changes
  useEffect(() => {
    fetchAvailability();
  }, [doctorId]);

  // Handle date selection from date scroller
  const handleDateSelect = (dateStr: string, dateSlot: DateSlot) => {
    if (!dateSlot.hasAvailability) {
      toast.error("No available appointments for this date");
      return;
    }

    setSelectedDate(dateStr);
    setCalendarDate(dateSlot.fullDate);

    // Generate time slots for selected date
    const timeSlotsForDate = generateTimeSlotsForDate(dateStr);
    setTimeSlots(timeSlotsForDate);

    // Select first time slot if available
    if (
      timeSlotsForDate.length > 0 &&
      !timeSlotsForDate.some((slot) => slot.time === selectedTime)
    ) {
      setSelectedTime(timeSlotsForDate[0].time);
    } else if (timeSlotsForDate.length === 0) {
      setSelectedTime("");
      toast.error("No available time slots for this date");
    }
  };

  // Handle calendar date change from CalendarDropdown
  const handleCalendarDateChange = (date: Date) => {
    setCalendarDate(date);
    const dateStr = date.toISOString().split("T")[0];

    // Check if the selected date is available
    const dateSlot = dates.find((d) => d.dateString === dateStr);

    if (dateSlot) {
      if (dateSlot.hasAvailability) {
        handleDateSelect(dateStr, dateSlot);
      } else {
        toast.error("Selected date is not available");
        // Find the next available date
        const nextAvailableDate = dates.find(
          (d) => d.hasAvailability && new Date(d.dateString) > date
        );
        if (nextAvailableDate) {
          setTimeout(() => {
            toast.success(
              `Next available date is ${nextAvailableDate.dayName}, ${nextAvailableDate.date}`
            );
          }, 1000);
        }
      }
    }
  };

  const selectedDateObj = dates.find((d) => d.dateString === selectedDate);
  const selectedTimeSlot = timeSlots.find((slot) => slot.time === selectedTime);

  // Format display string
  const formattedDateString =
    selectedDateObj && selectedTimeSlot
      ? `${
          selectedDateObj.dayName
        }, ${selectedDateObj.fullDate.toLocaleDateString("en-US", {
          month: "long",
        })} ${selectedDateObj.date} - ${selectedTimeSlot.formattedTime}`
      : "";

  // Handle booking
  // Handle booking - now just calls parent function
  const handleBooking = async () => {
    if (!selectedDateObj) {
      toast.error("Please select a date");
      return;
    }

    if (!selectedTimeSlot) {
      toast.error("Please select a time");
      return;
    }

    if (!doctorId) {
      toast.error("Doctor information is missing");
      return;
    }

    setIsBooking(true);

    try {
      // Prepare booking data for parent component
      const bookingData = {
        appointmentDate: selectedDateObj.fullDate,
        appointmentTime: selectedTimeSlot.formattedTime,
        startTime: selectedTimeSlot.startTime,
        endTime: selectedTimeSlot.endTime,
        paymentMethod: "stripe",
        notes: `Appointment with ${doctorName} at ${selectedTimeSlot.formattedTime}`,
      };

      console.log("Calling parent booking with:", bookingData);

      // Call parent's onBookAppointment function
      if (onBookAppointment) {
        await onBookAppointment(bookingData);
      } else {
        // Fallback if parent doesn't handle booking
        toast.error("Booking functionality not available");
      }
    } catch (err: any) {
      console.error("Booking error in child component:", err);
      toast.error("Failed to process booking request");
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
            <BasicDateCalendar
              doctorId={doctorId}
              onDateChange={handleCalendarDateChange}
              currentDate={calendarDate} // Add this prop
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2 mb-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="min-w-[70px] h-[80px] bg-gray-200 rounded-2xl animate-pulse"
                ></div>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-200 rounded-xl animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Date Scroller */}
            <div className="relative mb-8">
              {dates.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No available dates found</p>
                </div>
              ) : (
                <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
                  {dates.map((slot) => {
                    const isSelected = slot.dateString === selectedDate;
                    const isToday =
                      slot.dateString ===
                      new Date().toISOString().split("T")[0];

                    return (
                      <button
                        key={slot.dateString}
                        onClick={() => handleDateSelect(slot.dateString, slot)}
                        disabled={!slot.hasAvailability}
                        className={`flex flex-col items-center justify-center min-w-[70px] h-[80px] rounded-2xl transition-all duration-300 relative ${
                          isSelected
                            ? "bg-blue-700 text-white shadow-lg shadow-blue-200 scale-105"
                            : slot.hasAvailability
                            ? "bg-gray-50 text-gray-400 hover:bg-gray-100"
                            : "bg-gray-100 text-gray-300 cursor-not-allowed opacity-60"
                        }`}
                      >
                        {isToday && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                        )}
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
                        {!slot.hasAvailability && (
                          <span className="text-[10px] mt-1 text-gray-400">
                            Unavailable
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Time Slots */}
            <div className="mb-8">
              {timeSlots.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-xl">
                  <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">
                    No time slots available for this date
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Please select another date
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {timeSlots.map((slot) => {
                    const isSelected = slot.time === selectedTime;
                    return (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 flex flex-col items-center ${
                          isSelected
                            ? "bg-blue-700 text-white shadow-md"
                            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        <span className="font-semibold">
                          {slot.formattedTime}
                        </span>
                        <span className="text-xs opacity-75 mt-1">
                          {slot.timeRange}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* Price and Action */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-100 pt-6">
          <div className="flex items-center gap-6 mb-4 md:mb-0">
            <div className="flex items-center gap-2 text-slate-700">
              <div className="bg-blue-50 p-2 rounded-full text-blue-600">
                <Calendar size={18} />
              </div>
              <span className="font-medium">
                {formattedDateString || "Select date and time"}
              </span>
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
            disabled={
              isBooking || !selectedDateObj || !selectedTimeSlot || isLoading
            }
            className={`no-underline text-center  md:w-auto px-10 py-3 sm:py-4 cursor-pointer rounded-xl border font-semibold transition-colors ${
              isBooking || !selectedDateObj || !selectedTimeSlot || isLoading
                ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                : "bg-transparent border-blue-600 text-blue-600 hover:bg-blue-50"
            }`}
          >
            {isBooking ? "Booking..." : "Book"}
          </button>
        </div>

        {/* Availability Info */}
        {!isLoading && availabilitySlots.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>
                Showing {timeSlots.length} available time slots for selected
                date
              </span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Each appointment is 30 minutes
            </div>
          </div>
        )}
      </FadeIn>
    </div>
  );
};
