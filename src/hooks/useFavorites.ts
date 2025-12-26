import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import toast from "react-hot-toast";

// Types
interface FavoriteDoctor {
  id: number;
  name: string;
  email: string;
  mobile: string | null;
  profile_photo: string | null;
  specialty: {
    id: number;
    name: string;
    image: string;
  };
  license_number: string;
  bio: string | null;
  session_price: number;
  clinic_address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  experience_years: number;
  is_favorite: boolean;
}

interface FavoritesResponse {
  success: boolean;
  message: string;
  data: FavoriteDoctor[];
}

interface ToggleFavoriteResponse {
  success: boolean;
  message: string;
  data: {
    is_favorite: boolean;
  };
}

// Fetch favorite doctors
export const useFavorites = () => {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: async (): Promise<FavoriteDoctor[]> => {
      const response = await api.get<FavoritesResponse>("/profile/favorites");
      return response.data.data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Toggle favorite status
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (doctorId: number): Promise<ToggleFavoriteResponse> => {
      const response = await api.post<ToggleFavoriteResponse>(
        `/doctors/${doctorId}/favorite`
      );
      return response.data;
    },
    onSuccess: (data, doctorId) => {
      // Update favorites list
      queryClient.invalidateQueries({ queryKey: ["favorites"] });

      // Update doctor details cache if it exists
      queryClient.invalidateQueries({ queryKey: ["doctor", doctorId] });

      // Update doctors list cache if it exists
      queryClient.invalidateQueries({ queryKey: ["doctors"] });

      // Show success message
      const message = data.data.is_favorite
        ? "Doctor added to favorites"
        : "Doctor removed from favorites";
      toast.success(message);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update favorite status";
      toast.error(errorMessage);
    },
  });
};
