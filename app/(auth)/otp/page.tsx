import { OTPForm } from "@/components/auth/OTPForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Account | Keen Enterprises",
  description: "Verify your email to secure your account",
};

export default function OTPPage() {
  return <OTPForm />;
}
