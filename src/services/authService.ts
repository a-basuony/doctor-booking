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

  // Google login
  googleLogin: async (
    data: GoogleLoginData
  ): Promise<ApiResponse<GoogleLoginResponse>> => {
    const response = await api.post<ApiResponse<GoogleLoginResponse>>(
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
