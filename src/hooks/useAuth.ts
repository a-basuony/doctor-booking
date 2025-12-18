import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import toast from "react-hot-toast";
import { authService } from "../services/authService";
import { profileService } from "../services/profileService";
import { ROUTES } from "../constants/routes";
import { AuthContext } from "../contexts/AuthContext";
import type {
  SignUpData,
  SignInData,
  VerifyOTPData,
  ResendOTPData,
  ChangePasswordData,
} from "../types/auth";
import { TOAST_DURATION } from "../constants";
import { getErrorMessage } from "../utils/utils.";

// Sign Up mutation
export const useSignUp = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: SignUpData) => authService.signUp(data),
    onSuccess: (response, data) => {
      console.log("Sign up response:", response);
      toast.success(response.message);

      // Navigate to OTP verification
      navigate(ROUTES.VERIFY_OTP, {
        state: { phone: data.phone },
      });
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message, { duration: TOAST_DURATION });
    },
  });
};

// Sign In mutation
export const useSignIn = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignInData) => authService.signIn(data),
    onSuccess: (response) => {
      console.log("Sign in response:", response);

      // Save only the token
      localStorage.setItem("authToken", response.data.token);

      // Invalidate user query to trigger fresh fetch
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });

      toast.success(response.message);
      navigate(ROUTES.HOME);
    },
    onError: (error) => {
      console.log("Sign in error:", error);
      const message = getErrorMessage(error);
      toast.error(message, { duration: TOAST_DURATION });
      if (
        message.toLowerCase().includes("otp") ||
        message.toLowerCase().includes("verify")
      ) {
        navigate(ROUTES.VERIFY_OTP);
      }
    },
  });
};

// Verify OTP mutation
export const useVerifyOTP = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: VerifyOTPData) => authService.verifyOTP(data),
    onSuccess: (response) => {
      console.log("OTP verification response:", response);

      toast.success(response.message);
      // Navigate to sign in page to get the token
      toast("Please sign in to continue", { icon: "ℹ️" });
      navigate(ROUTES.SIGN_IN);
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

// Resend OTP mutation
export const useResendOTP = () => {
  return useMutation({
    mutationFn: (data: ResendOTPData) => authService.resendOTP(data),
    onSuccess: (response) => {
      console.log(response);
      toast.success(response.message);
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

// Get current user from API
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await profileService.getProfile();
      return response.data;
    },
    enabled: !!localStorage.getItem("authToken"),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordData) => authService.changePassword(data),
    onSuccess: (response) => {
      console.log(response);
      toast.success("Password updated successfully!");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate(ROUTES.SIGN_IN);
    },
    onError: () => {
      // Even if API call fails, clear local data
      localStorage.removeItem("authToken");
      queryClient.clear();
      navigate(ROUTES.SIGN_IN);
    },
  });
};

// Auth context hook
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
