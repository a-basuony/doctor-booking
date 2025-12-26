import type { ApiResponse, User, UpdateProfileData } from "../types/auth";
import { api } from "./api";

export const profileService = {
  // Get user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>("/profile/show");
    return response.data;
  },

  // Update profile
  updateProfile: async (
    data: UpdateProfileData | FormData
  ): Promise<ApiResponse<User>> => {
    // Check if data is FormData (contains image)
    const isFormData = data instanceof FormData;

    const response = await api.post<ApiResponse<User>>("/profile/edit", data, {
      headers: isFormData
        ? {
            "Content-Type": "multipart/form-data",
          }
        : undefined,
    });
    return response.data;
  },
};
