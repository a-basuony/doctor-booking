import z from "zod";

// Password validation helper
const passwordValidation = z.string().min(8, "Must be at least 8 characters")
.refine((val) => /[a-z]/.test(val), "Must contain a lowercase letter")
.refine((val) => /[A-Z]/.test(val), "Must contain an uppercase letter")
.refine((val) => /\d/.test(val), "Must contain a number")
.refine(
  (val) => /[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/]/.test(val),
  "Must contain a special character"
);

// Auth pages
export const signInSchema = z.object({
  phone: z.string().min(11, "Phone number must be at least 11 digits"),
  password: passwordValidation,
});

export const signUpSchema = z
  .object({
    name: z.string().min(8, "Name must be at least 8 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(11, "Phone number must be at least 11 digits"),
    password: passwordValidation,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
//Profile Page

export const personalInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().optional(),
  day: z.number().min(1).max(31).optional(),
  month: z.number().min(1).max(12).optional(),
  year: z.number().min(1900).max(new Date().getFullYear()).optional(),
});

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, "Current password is required"),
    newPassword: passwordValidation,
    confirmPassword: z.string().min(8, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export const otpSchema = z.object({
  otp: z.string().length(4, "OTP must be 4 digits"),
});

export const phoneVerificationSchema = z.object({
  phone: z.string().min(11, "Phone number must be at least 11 digits"),
});

export const resetPasswordSchema = z
  .object({
    newPassword: passwordValidation,
    confirmPassword: z.string().min(8, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
