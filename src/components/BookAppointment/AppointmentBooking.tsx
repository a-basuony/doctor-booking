import "react-datepicker/dist/react-datepicker.css";

import React, { useState } from "react";
import {
  Calendar,
} from "lucide-react";
// import { DateSlot, TimeSlot } from "../../types/appointment";
import { FadeIn } from "./FadeIn";
import BasicDateCalendar from "./CalendarDropdown";
import { Link } from "react-router-dom";

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

export const AppointmentBooking: React.FC = () => {
  // Generate dummy dates starting from Nov 12, 2024 to match UI
  const generateDates = (): DateSlot[] => {
    const dates: DateSlot[] = [];
    const startDate = new Date(2024, 10, 12); // Nov 12, 2024

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
  const [selectedDate, setSelectedDate] = useState<number>(15); // Default to Mon 15
  const [selectedTime, setSelectedTime] = useState<string>("11:00 AM");

  const selectedDateObj = dates.find((d) => d.date === selectedDate);
  const formattedDateString = selectedDateObj
    ? `${
        selectedDateObj.day === "Thu"
          ? "Thursday"
          : selectedDateObj.day === "Tue"
          ? "Tuesday"
          : selectedDateObj.day + "day"
      }, November ${selectedDate} - ${selectedTime}`
    : "";

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
      <FadeIn>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-gray-500 text-sm font-semibold sm:text-lg sm:font-medium ">
            Choose date and time
          </h2>
          <div className="flex items-center gap-2 text-gray-800 font-semibold cursor-pointer">
            <BasicDateCalendar />
            {/* <Calendar size={18} />
            <span className="text-gray-500 text-sm font-semibold sm:text-lg sm:font-medium">
              November, 2024
            </span>
            <ChevronDown size={18} /> */}
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

        {/* Footer Action */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-100 pt-6">
          <div className="flex items-center gap-2 text-slate-700 mb-4 md:mb-0">
            <div className="bg-blue-50 p-2 rounded-full text-blue-600">
              <Calendar size={18} />
            </div>
            <span className="font-medium">{formattedDateString}</span>
          </div>

          <Link
            to="/payment"
            className=" no-underline text-center  w-96 md:w-auto px-10 py-3 sm:py-4 cursor-pointer bg-transparent rounded-xl border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
          >
            {/* <button className="w-full md:w-auto px-10 py-4 cursor-pointer bg-transparent rounded-xl border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition-colors"> */}
            Book
            {/* </button> */}
          </Link>
        </div>
      </FadeIn>
    </div>
  );
};
