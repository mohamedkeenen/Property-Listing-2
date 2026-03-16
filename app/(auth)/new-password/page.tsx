import { NewPasswordForm } from "@/components/auth/NewPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Password | Keen Enterprises",
  description: "Set a new password for your account",
};

export default function NewPasswordPage() {
  return <NewPasswordForm />;
}
