export interface Birthdate {
  Day: number;
  Month: number;
  Year: number;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  extra_data: {
    birthdate?: Birthdate;
  };
}

export interface UpdateProfileData {
  name: string;
  email: string;
  phone: string;
  birthDay?: number;
  birthMonth?: number;
  birthYear?: number;
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
  phone: string;
  otp: string;
}

export interface ResendOTPData {
  phone: string;
}

// Backend response wrapper
export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

// Sign In Response - Only returns token
export interface SignInResponse {
  token: string;
}

// Sign Up Response - Returns basic user info without id
export interface SignUpResponse {
  name: string;
  email: string;
  phone: string;
}

// OTP Verification Response - Only returns success message (no data)
export type OTPVerificationResponse = Record<string, never>;

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface ForgetPasswordData {
  phone: string;
}

export interface ResetPasswordData {
  phone: string;
  otp: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface GoogleLoginData {
  id_token: string;
}

export interface GoogleLoginResponse {
  token: string;
}
