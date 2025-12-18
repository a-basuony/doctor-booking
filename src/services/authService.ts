import type {
  SignUpData,
  SignInData,
  VerifyOTPData,
  ResendOTPData,
  User,
  ApiResponse,
  SignInResponse,
  SignUpResponse,
  OTPVerificationResponse,
  ChangePasswordData,
} from "../types/auth";
import { api } from "./api";

// Authentication service functions
export const authService = {
  // Sign up
  signUp: async (data: SignUpData): Promise<ApiResponse<SignUpResponse>> => {
    const response = await api.post<ApiResponse<SignUpResponse>>(
      "/auth/register",
      data
    );
    return response.data;
  },

  // Sign in
  signIn: async (data: SignInData): Promise<ApiResponse<SignInResponse>> => {
    const response = await api.post<ApiResponse<SignInResponse>>(
      "/auth/login",
      data
    );
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (
    data: VerifyOTPData
  ): Promise<ApiResponse<OTPVerificationResponse>> => {
    const response = await api.post<ApiResponse<OTPVerificationResponse>>(
      "/auth/verify-otp",
      data
    );
    return response.data;
  },

  // Resend OTP
  resendOTP: async (
    data: ResendOTPData
  ): Promise<ApiResponse<{ otp: number }>> => {
    const response = await api.post<ApiResponse<{ otp: number }>>(
      "/auth/resend-otp",
      data
    );
    return response.data;
  },

  // Get current user from localStorage
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("authToken");

    if (!token || !userStr) {
      return null;
    }

    try {
      return JSON.parse(userStr) as User;
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      return null;
    }
  },

  changePassword: async (
    data: ChangePasswordData
  ): Promise<ApiResponse<void>> => {
    const response = await api.put<ApiResponse<void>>(
      "/profile/change-password",
      data
    );
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await api.post("/profile/logout");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("tempPhoneNumber");
    localStorage.removeItem("tempUserData");
  },
};
