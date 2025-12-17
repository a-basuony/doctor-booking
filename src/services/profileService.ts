import type { ApiResponse, User } from "../types/auth";
import { api } from "./api";

export const profileService = {
  // Sign up
  updateProfile: async (data: User): Promise<ApiResponse<User>> => {
    const response = await api.put<ApiResponse<User>>("/profile/edit", data);
    return response.data;
  },
};
