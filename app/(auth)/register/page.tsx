import { RegisterForm } from "@/components/auth/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | Keen Enterprises",
  description: "Join Keen Enterprises property management platform",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
