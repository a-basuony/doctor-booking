import { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { Calendar, ChevronDown } from "lucide-react";
import { api } from "../../services/api";

interface BasicDateCalendarProps {
  doctorId?: string;
  onDateChange?: (date: Date) => void;
  currentDate?: Date;
}

interface UnavailableDate {
  date: string; // YYYY-MM-DD format
  reason?: string;
}

export default function BasicDateCalendar({
  doctorId,
  onDateChange,
  currentDate,
}: BasicDateCalendarProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [unavailableDates, setUnavailableDates] = useState<UnavailableDate[]>(
    []
  );
  const [_isLoading, _setIsLoading] = useState(false);

  // Initialize with currentDate prop if provided
  useEffect(() => {
    if (currentDate) {
      setSelectedDate(dayjs(currentDate));
    }
  }, [currentDate]);

  // Fetch doctor's unavailable dates
  useEffect(() => {
    if (doctorId) {
      fetchUnavailableDates();
    }
  }, [doctorId]);

  const fetchUnavailableDates = async () => {
    if (!doctorId) return;

    _setIsLoading(true);
    try {
      // Adjust this API endpoint based on your backend
      const response = await api.get<{
        success: boolean;
        data: UnavailableDate[];
      }>(`/doctors/${doctorId}/unavailable-dates`);

      if (response.data.success) {
        setUnavailableDates(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching unavailable dates:", error);
    } finally {
      _setIsLoading(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    console.log("Selected date:", selectedDate.format("YYYY-MM-DD"));
    if (onDateChange) {
      onDateChange(selectedDate.toDate());
    }
    setOpen(false);
  };

  // Check if a date is unavailable
  const isDateUnavailable = (date: Dayjs): boolean => {
    const dateStr = date.format("YYYY-MM-DD");
    return unavailableDates.some((unavailable) => unavailable.date === dateStr);
  };

  // Check if a date should be disabled in the calendar
  const shouldDisableDate = (date: Dayjs): boolean => {
    // Disable past dates
    if (date.isBefore(dayjs().startOf("day"))) {
      return true;
    }

    // Check if date is in unavailable dates
    return isDateUnavailable(date);
  };

  // Format month and year for display
  const displayMonthYear = selectedDate.format("MMMM, YYYY");

  // Handle date selection in calendar
  const handleDateSelection = (newDate: Dayjs | null) => {
    if (newDate) {
      // Don't allow selection of disabled dates
      if (!shouldDisableDate(newDate)) {
        setSelectedDate(newDate);
      }
    }
  };

  return (
    <>
      {/* Button to trigger the date picker modal */}
      <div
        onClick={handleClickOpen}
        className="flex items-center gap-2 text-gray-800 font-semibold cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
        role="button"
        aria-label="Open calendar"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClickOpen();
          }
        }}
      >
        <Calendar size={18} className="text-gray-600" />
        <span className="text-gray-600 text-sm font-medium sm:text-base">
          {displayMonthYear}
        </span>
        <ChevronDown size={16} className="text-gray-500" />
      </div>

      {/* Dialog/Modal containing the date calendar */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
          },
        }}
      >
        <DialogTitle className="text-lg font-semibold text-gray-800">
          Select Appointment Date
        </DialogTitle>
        <DialogContent className="p-0">
          <div className="relative">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={selectedDate}
                onChange={handleDateSelection}
                shouldDisableDate={shouldDisableDate}
                disablePast
                views={["day", "month", "year"]}
                sx={{
                  width: "100%",
                  "& .MuiPickersDay-root": {
                    borderRadius: "8px",
                    margin: "2px",
                  },
                  "& .MuiPickersDay-today": {
                    border: "2px solid #3b82f6",
                    backgroundColor: "transparent",
                  },
                  "& .Mui-selected": {
                    backgroundColor: "#3b82f6 !important",
                    color: "white",
                  },
                  "& .MuiPickersDay-disabled": {
                    color: "#d1d5db",
                    cursor: "not-allowed",
                  },
                }}
              />
            </LocalizationProvider>

            {/* Legend for unavailable dates */}
            {unavailableDates.length > 0 && (
              <div className="px-4 pb-4 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                  <span>Unavailable dates</span>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions className="px-6 py-4 border-t border-gray-100">
          <Button
            onClick={handleClose}
            className="text-gray-600 hover:bg-gray-100"
            sx={{
              textTransform: "none",
              fontWeight: 500,
              borderRadius: "8px",
              px: 2,
              py: 1,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            sx={{
              textTransform: "none",
              fontWeight: 500,
              borderRadius: "8px",
              px: 3,
              py: 1,
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              },
            }}
            disabled={shouldDisableDate(selectedDate)}
          >
            Confirm Date
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
