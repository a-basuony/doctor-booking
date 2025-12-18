import type { ApiResponse, User } from "../types/auth";
import { api } from "./api";

export const profileService = {
  // Get user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>("/profile/show");
    return response.data;
  },

  // Update profile
  updateProfile: async (data: User): Promise<ApiResponse<User>> => {
    const response = await api.put<ApiResponse<User>>("/profile/edit", data);
    return response.data;
  },
};
