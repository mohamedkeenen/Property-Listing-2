import { NewPasswordForm } from "@/components/auth/NewPasswordForm";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "New Password | Keen Enterprises",
  description: "Set a new password for your account",
};

export default function NewPasswordPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <NewPasswordForm />
    </Suspense>
  );
}
