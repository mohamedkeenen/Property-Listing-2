import { OTPForm } from "@/components/auth/OTPForm";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Verify Account | Keen Enterprises",
  description: "Verify your email to secure your account",
};

export default function OTPPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <OTPForm />
    </Suspense>
  );
}
