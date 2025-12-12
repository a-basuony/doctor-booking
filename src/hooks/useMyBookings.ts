import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// get appointments/my-bookings
  const BOOKING_CONFIG = {
  BASE_URL: 'https://round8-cure-php-team-two.huma-volve.com/api/v1/',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_PUBLIC_API_KEY}`,
  },
};

export const useMyBookings = () => {
  return useQuery({
    queryKey: ['myBooking'],
    queryFn: async () => {
      const response = await axios.get(
        `${BOOKING_CONFIG.BASE_URL}appointments/my-bookings`,
        { headers: BOOKING_CONFIG.headers }
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};


