import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const api = axios.create({
  baseURL: "https://your-api", 
});


// ------------------------------------------------------------------------------

// get appointments/my-bookings
  const BOOKING_CONFIG = {
  BASE_URL: 'https://round8-cure-php-team-two.huma-volve.com/api/v1/',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer 7|MFmla0NmwKFUDNaJ3BqHYEpK4npbuG6yMHg6DM1Y082b2deb',
  },
};

export const getMyBookings = () => {
  return useQuery({
    queryKey: ['myBooking'],
    queryFn: async () => {
      const response = await axios.get(
        `${BOOKING_CONFIG.BASE_URL}appointments/my-bookings`,
        {
          headers: BOOKING_CONFIG.headers,
        }
      );
      return response.data; // هنا الـ data هي الـ response الكامل من الـ API
    },
    staleTime: 1000 * 60 * 5, // 5 دقايق
    retry: 2,
    refetchOnWindowFocus: false,
  });
};


// ------------------------------------------------------------------------------
 
