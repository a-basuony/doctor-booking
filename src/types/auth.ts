export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  email_verified_at: string | null;
  image: string | null;
  provider_id: string | null;
  location: string | null;
  status: boolean | number;
  gender: string;
  bir_of_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface SignUpData {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

export interface SignInData {
  phone: string;
  password: string;
}

export interface VerifyOTPData {
  user_id: string;
  otp: string;
}

export interface ResendOTPData {
  phone: string;
  user_id: string;
}

// Backend response wrapper
export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

// Sign In Response
export interface SignInResponse {
  data: User;
  token: string;
  token_type: string;
}

// Sign Up Response
export interface SignUpResponse {
  user_id: number;
  otp: number;
}

// OTP Verification Response
export type OTPVerificationResponse = User;
