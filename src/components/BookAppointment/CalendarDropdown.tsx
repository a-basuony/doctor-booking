import { useState } from "react";
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

interface BasicDateCalendarProps {
  onDateChange?: (date: Date) => void;
}

export default function BasicDateCalendar({
  onDateChange,
}: BasicDateCalendarProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

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

  // Format month and year for display
  const displayMonthYear = selectedDate.format("MMMM, YYYY");

  return (
    <>
      {/* Button to trigger the date picker modal */}
      <div
        onClick={handleClickOpen}
        className="flex items-center gap-2 text-gray-800 font-semibold cursor-pointer"
      >
        <Calendar size={18} />
        <span className="text-gray-500 text-sm font-semibold sm:text-lg sm:font-medium">
          {displayMonthYear}
        </span>
        <ChevronDown size={18} />
      </div>

      {/* Dialog/Modal containing the date calendar */}
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Select a Date</DialogTitle>
        <DialogContent
          sx={{ display: "flex", justifyContent: "center", py: 2 }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={selectedDate}
              onChange={(newDate) => newDate && setSelectedDate(newDate)}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirm} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
