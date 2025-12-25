import type {
  SignUpData,
  SignInData,
  VerifyOTPData,
  ResendOTPData,
  ApiResponse,
  SignInResponse,
  SignUpResponse,
  OTPVerificationResponse,
  ChangePasswordData,
  ResetPasswordData,
  GoogleLoginData,
  GoogleLoginResponse,
} from "../types/auth";
import { api } from "./api";
import axios from "axios";

// Create a direct API instance that bypasses the proxy for Google OAuth
const directApi = axios.create({
  baseURL: "https://round8-backend-team-one.huma-volve.com/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add the same interceptor for public API key
directApi.interceptors.request.use(
  (config) => {
    const publicApiKey = import.meta.env.VITE_PUBLIC_API_KEY;
    if (publicApiKey) {
      config.headers.Authorization = `Bearer ${publicApiKey}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

  changePassword: async (
    data: ChangePasswordData
  ): Promise<ApiResponse<void>> => {
    const response = await api.put<ApiResponse<void>>(
      "/profile/change-password",
      data
    );
    return response.data;
  },
  forgetPassword: async (phone: {
    phone: string;
  }): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>(
      "/auth/forget-password",
      phone
    );
    return response.data;
  },

  // Reset password
  resetPassword: async (
    data: ResetPasswordData
  ): Promise<ApiResponse<void>> => {
    const response = await api.put<ApiResponse<void>>(
      "/auth/reset-password",
      data
    );
    return response.data;
  },

  // Google login - use direct API to bypass proxy
  googleLogin: async (
    data: GoogleLoginData
  ): Promise<ApiResponse<GoogleLoginResponse>> => {
    const response = await directApi.post<ApiResponse<GoogleLoginResponse>>(
      "/auth/google-login",
      data
    );
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await api.post("/profile/logout");
    localStorage.removeItem("authToken");
  },
};
