import z from "zod";

export const signInSchema = z.object({
  phone: z.string().min(11, "Phone number must be at least 11 digits"),
});

export const signUpSchema = z.object({
  fullName: z.string().min(5, "Name must be at least 5 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 11 digits"),
});
