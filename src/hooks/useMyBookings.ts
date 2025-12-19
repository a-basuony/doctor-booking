import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { api } from "../services/api";

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
//GET list Booking
export const useMyBookings = () => {
  return useQuery<BookingResponse[]>({
    queryKey: ['myBooking'],
    queryFn: async () => {
      const response = await api.get<ApiResponse>('/bookings');
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Cancel booking

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(`/bookings/${id}/cancel`, {
        cancellation_reason: "Cancelled by user"
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['myBooking'] });
      toast.success("Appointment canceled successfully");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || "Failed to cancel appointment";
      toast.error(message);
    },
  });
};

// Reschedule booking

export const useRescheduleBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, date, time }: { id: number; date: string; time: string }) => {
      const response = await api.put(`/bookings/${id}`, {
        appointment_date: date,
        appointment_time: time,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBooking'] });
      toast.success("Appointment rescheduled successfully");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || "Failed to reschedule appointment";
      toast.error(message);
    },
  });
};


