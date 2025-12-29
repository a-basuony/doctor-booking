import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import toast from "react-hot-toast";

// Types for API response
interface UserData {
  id: number;
  name: string;
  email: string;
  mobile: string | null;
  profile_photo: string | null;
}

interface SpecialtyData {
  id: number;
  name: string;
  image: string | null;
}

interface DoctorData {
  id: number;
  user_id: number;
  specialty_id: number;
  license_number: string;
  bio: string | null;
  session_price: number;
  clinic_address: string;
  latitude: number;
  longitude: number;
  experience_length: number;
  created_at: string;
  updated_at: string;
  user?: UserData;
  specialty?: SpecialtyData;
}

interface FavoriteItem {
  id: number;
  patient_id: number;
  doctor_id: number;
  created_at: string;
  updated_at: string;
  doctor: DoctorData;
}

interface FavoritesAPIResponse {
  success: boolean;
  data: FavoriteItem[];
}

// Transformed type for UI
export interface FavoriteDoctor {
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
      // Request with user and specialty relations
      const response = await api.get<FavoritesAPIResponse>(
        "/profile/favorites?with=doctor.user,doctor.specialty"
      );

      if (!response.data.data || response.data.data.length === 0) {
        return [];
      }

      // Transform the nested API response to the flat structure expected by the UI
      const transformedData: FavoriteDoctor[] = response.data.data.map(
        (item) => {
          const doctor = item.doctor;
          const user = doctor.user;
          const specialty = doctor.specialty;

          return {
            id: doctor.id,
            name: user?.name || `Doctor ${doctor.id}`,
            email: user?.email || "",
            mobile: user?.mobile || null,
            profile_photo: user?.profile_photo || null,
            specialty: {
              id: specialty?.id || doctor.specialty_id,
              name: specialty?.name || "General",
              image: specialty?.image || "",
            },
            license_number: doctor.license_number,
            bio: doctor.bio,
            session_price: doctor.session_price,
            clinic_address: doctor.clinic_address,
            location: {
              latitude: doctor.latitude,
              longitude: doctor.longitude,
            },
            experience_years: doctor.experience_length,
            is_favorite: true, // Always true for favorites list
          };
        }
      );

      return transformedData;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Toggle favorite status
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (doctorId: number): Promise<ToggleFavoriteResponse> => {
      console.log(`🔄 Toggling favorite for doctor ID: ${doctorId}`);
      console.log(`📡 API URL: /doctors/${doctorId}/favorite`);

      try {
        const response = await api.post<ToggleFavoriteResponse>(
          `/doctors/${doctorId}/favorite`
        );

        console.log('✅ Toggle favorite response:', response.data);
        return response.data;
      } catch (error) {
        const axiosError = error as { response?: { data?: unknown; status?: number } };
        console.error('❌ Toggle favorite error:', error);
        console.error('Error response:', axiosError.response?.data);
        console.error('Error status:', axiosError.response?.status);
        throw error;
      }
    },
    onSuccess: (data, doctorId) => {
      console.log('✨ Toggle favorite success:', data);

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
      console.error('💥 Toggle favorite mutation error:', error);
      const errorMessage =
        error.response?.data?.message || "Failed to update favorite status";
      toast.error(errorMessage);
    },
  });
};
