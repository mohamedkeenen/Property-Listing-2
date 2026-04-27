import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { OTPForm } from "@/components/auth/OTPForm";
import { NewPasswordForm } from "@/components/auth/NewPasswordForm";
import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{ flow: string }>;
};

export async function generateStaticParams() {
  return [
    { flow: "login" },
    { flow: "register" },
    { flow: "forgot-password" },
    { flow: "otp" },
    { flow: "new-password" },
    { flow: "verify-email" },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { flow } = await params;
  const titles: Record<string, string> = {
    login: "Sign In",
    register: "Create Account",
    "forgot-password": "Forgot Password",
    otp: "Verify Account",
    "new-password": "New Password",
    "verify-email": "Email Verification",
  };

  const title = titles[flow] || "Authentication";
  return {
    title: `${title} | Keen Enterprises`,
    description: "Property management platform authentication",
  };
}

export default async function AuthPage({ params }: Props) {
  const { flow } = await params;

  switch (flow) {
    case "login":
      return <LoginForm />;
    case "register":
      return <RegisterForm />;
    case "forgot-password":
      return <ResetPasswordForm />;
    case "otp":
      return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center font-black uppercase tracking-widest text-[10px] text-muted-foreground/40">Loading security...</div>}>
          <OTPForm />
        </Suspense>
      );
    case "new-password":
      return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center font-black uppercase tracking-widest text-[10px] text-muted-foreground/40">Loading security...</div>}>
          <NewPasswordForm />
        </Suspense>
      );
    case "verify-email":
      return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center font-black uppercase tracking-widest text-[10px] text-muted-foreground/40">Loading verification...</div>}>
          <VerifyEmailForm />
        </Suspense>
      );
    default:
      notFound();
  }
}
