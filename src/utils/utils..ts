// Helper function to extract error messages
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorMessage = (error: any): string => {
  // Check for validation errors with errors object
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    const errorMessages = Object.values(errors).flat().join(", ");
    return errorMessages;
  }

  // Check for simple error message
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Default error message
  return "An error occurred. Please try again.";
};

// Date format conversion functions
/**
 * Convert date from yyyy-mm-dd to d-m-Y format
 * @param date - Date string in yyyy-mm-dd format (e.g., "1990-01-01")
 * @returns Date string in d-m-Y format (e.g., "1-1-1990") or empty string if invalid
 */
export const convertToBackendDateFormat = (date: string): string => {
  if (!date) return "";

  const parts = date.split("-");
  if (parts.length !== 3) return "";

  const [year, month, day] = parts;
  // Remove leading zeros from day and month
  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);

  return `${dayNum}-${monthNum}-${year}`;
};

/**
 * Convert date from d-m-Y to yyyy-mm-dd format
 * @param date - Date string in d-m-Y format (e.g., "1-1-1990")
 * @returns Date string in yyyy-mm-dd format (e.g., "1990-01-01") or empty string if invalid
 */
export const convertToFrontendDateFormat = (date: string): string => {
  if (!date) return "";

  const parts = date.split("-");
  if (parts.length !== 3) return "";

  const [day, month, year] = parts;
  // Add leading zeros to day and month
  const dayStr = day.padStart(2, "0");
  const monthStr = month.padStart(2, "0");

  return `${year}-${monthStr}-${dayStr}`;
};
