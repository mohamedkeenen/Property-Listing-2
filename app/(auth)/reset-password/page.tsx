import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Keen Enterprises",
  description: "Recover your account access",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
