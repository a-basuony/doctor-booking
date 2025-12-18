import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

// get appointments/my-bookings
  const BOOKING_CONFIG = {
  BASE_URL: 'https://round8-backend-team-one.huma-volve.com',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_PUBLIC_API_KEY}`,
  },
};

// Define types based on API response
export interface BookingDoctor {
  id: number;
  name: string;
  speciality: string;
  image: string | null;
  address: string;
}

export interface BookingPatient {
  id: number;
  name: string;
  image: string | null;
}

export interface BookingResponse {
  id: number;
  doctor: BookingDoctor;
  patient: BookingPatient;
  appointment_date: string;
  appointment_time: string;
  status: string;
  price: number;
  payment_method: string;
  payment_status: string;
  notes: string;
  cancellation_reason: string | null;
  cancelled_at: string | null;
  created_at: string;
}

interface ApiResponse {
  data: BookingResponse[];
}

export const useMyBookings = () => {
  return useQuery<BookingResponse[]>({
    queryKey: ['myBooking'],
    queryFn: async () => {
      const response = await axios.get<ApiResponse>(
        `${BOOKING_CONFIG.BASE_URL}/api/bookings`,
        { headers: BOOKING_CONFIG.headers }
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      console.log('Attempting to cancel booking:', id);
      const url = `${BOOKING_CONFIG.BASE_URL}/api/bookings/${id}/cancel`;
      console.log('URL:', url);
      const response = await axios.post(
        url,
        {},
        { headers: BOOKING_CONFIG.headers }
      );
      console.log('Cancel response:', response);
      return response;
    },
    onSuccess: (data) => {
      console.log('Cancel success:', data);
      queryClient.invalidateQueries({ queryKey: ['myBooking'] });
      toast.success("Appointment canceled successfully");
    },
    onError: (error: any) => {
      console.error("Cancel error full object:", error);
      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
        console.error("Response status:", error.response?.status);
      }
      toast.error(`Failed to cancel: ${error.message}`);
    },
  });
};

export const useRescheduleBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, date, time }: { id: number; date: string; time: string }) => {
      const response = await axios.put(
        `${BOOKING_CONFIG.BASE_URL}/api/bookings/${id}`,
        {
          appointment_date: date,
          appointment_time: time,
        },
        { headers: BOOKING_CONFIG.headers }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBooking'] });
      toast.success("Appointment rescheduled successfully");
    },
    onError: (error: any) => {
      console.error("Reschedule error:", error);
      toast.error(error.response?.data?.message || "Failed to reschedule appointment");
    },
  });
};


