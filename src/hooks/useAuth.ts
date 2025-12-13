import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import toast from "react-hot-toast";
import { authService } from "../services/authService";
import { ROUTES } from "../constants/routes";
import { AuthContext } from "../contexts/AuthContext";
import type {
  SignUpData,
  SignInData,
  VerifyOTPData,
  ResendOTPData,
} from "../types/auth";
import { TOAST_DURATION } from "../constants";

// Helper function to extract error messages
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getErrorMessage = (error: any): string => {
  // Check for validation errors with errors object
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    const errorMessages = Object.values(errors).flat().join(", ");
    return errorMessages;
  }

  // Check for simple error message
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Default error message
  return "An error occurred. Please try again.";
};

// Sign Up mutation
export const useSignUp = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: SignUpData) => authService.signUp(data),
    onSuccess: (response, data) => {
      console.log(response);
      toast.success(response.message);
      // Store user_id and phone for OTP verification
      localStorage.setItem("tempUserId", response.data.user_id.toString());
      // Navigate to OTP verification
      navigate(ROUTES.VERIFY_OTP, {
        state: { userId: response.data.user_id, phone: data.phone },
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
      // Save token and user data to localStorage
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data));

      // Update React Query cache with user data
      queryClient.setQueryData(["currentUser"], response.data.data);

      toast.success(response.message);
      navigate(ROUTES.HOME);
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message, { duration: TOAST_DURATION });
    },
  });
};

// Verify OTP mutation
export const useVerifyOTP = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VerifyOTPData) => authService.verifyOTP(data),
    onSuccess: (response) => {
      console.log(response);
      // OTP verification doesn't return a token, need to sign in after
      // Store user data temporarily
      localStorage.setItem("user", JSON.stringify(response.data));
      queryClient.setQueryData(["currentUser"], response.data);
      // Clean up temporary data
      localStorage.removeItem("tempUserId");
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

// Get current user from localStorage
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: authService.getCurrentUser,
    enabled: !!localStorage.getItem("authToken"),
    retry: false,
    staleTime: Infinity, // User data from localStorage doesn't go stale
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
      localStorage.removeItem("user");
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
