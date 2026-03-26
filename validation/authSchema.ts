import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address. Please include '@' and a valid domain." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export const registerSchema = z.object({
  full_name: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address. Please include '@' and a valid domain." }),
  phone: z.string().optional(),
  company_name: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  password_confirmation: z.string().min(1, { message: "Password confirmation is required." }),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

export const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be exactly 6 digits." }),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  password_confirmation: z.string().min(1, { message: "Password confirmation is required." }),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type OtpValues = z.infer<typeof otpSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
