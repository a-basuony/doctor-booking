import { FormControl, MenuItem, Select, Box, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import type { Control } from "react-hook-form";

interface BirthdateSelectProps {
  control: Control<any>;
  errors?: {
    day?: { message?: string };
    month?: { message?: string };
    year?: { message?: string };
  };
}

const BirthdateSelect = ({ control, errors }: BirthdateSelectProps) => {
  // Generate days (1-31)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Generate months (1-12)
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  // Generate years (current year down to 100 years ago)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  return (
    <Box>
      <Typography
        variant="body2"
        sx={{
          mb: 1,
          color: "text.secondary",
          fontWeight: 500,
        }}
      >
        Date of Birth
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        {/* Day Select */}
        <FormControl fullWidth error={!!errors?.day}>
          <Controller
            name="day"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                displayEmpty
                value={field.value || ""}
                onChange={(e) => field.onChange(Number(e.target.value))}
                sx={{
                  "& .MuiSelect-select": {
                    py: 1.5,
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Day
                </MenuItem>
                {days.map((day) => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors?.day && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
              {errors.day.message}
            </Typography>
          )}
        </FormControl>

        {/* Month Select */}
        <FormControl fullWidth error={!!errors?.month}>
          <Controller
            name="month"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                displayEmpty
                value={field.value || ""}
                onChange={(e) => field.onChange(Number(e.target.value))}
                sx={{
                  "& .MuiSelect-select": {
                    py: 1.5,
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Month
                </MenuItem>
                {months.map((month) => (
                  <MenuItem key={month.value} value={month.value}>
                    {month.label}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors?.month && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
              {errors.month.message}
            </Typography>
          )}
        </FormControl>

        {/* Year Select */}
        <FormControl fullWidth error={!!errors?.year}>
          <Controller
            name="year"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                displayEmpty
                value={field.value || ""}
                onChange={(e) => field.onChange(Number(e.target.value))}
                sx={{
                  "& .MuiSelect-select": {
                    py: 1.5,
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Year
                </MenuItem>
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors?.year && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
              {errors.year.message}
            </Typography>
          )}
        </FormControl>
      </Box>
    </Box>
  );
};

export default BirthdateSelect;
