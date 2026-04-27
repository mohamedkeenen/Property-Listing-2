import { LoginForm } from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Keen Enterprises",
  description: "Access your property management dashboard",
};

export default function LoginPage() {
  return <LoginForm />;
}
