"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useRegisterMutation, useVerifyEmailMutation } from "@/api/redux/services/authApi";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Suspense } from "react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const hasAttempted = useRef(false);

  useEffect(() => {
    if (!token || hasAttempted.current) {
      if (!token) setStatus("error");
      return;
    }

    const performVerification = async () => {
      hasAttempted.current = true;
      try {
        await verifyEmail({ token }).unwrap();
        setStatus("success");
        toast.success("Email verified successfully!");
      } catch (err: any) {
        setStatus("error");
        toast.error(err.data?.message || "Verification failed. Please try again.");
      }
    };

    performVerification();
  }, [token, verifyEmail]);

  return (
    <div className="flex flex-col space-y-4 w-full max-w-[400px]">
      <Card className="border-emerald-100 shadow-xl shadow-emerald-900/5">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-emerald-900">Email Verification</CardTitle>
          <CardDescription>
            {status === "loading" && "Verifying your email address..."}
            {status === "success" && "Your account has been activated!"}
            {status === "error" && "We couldn't verify your email."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          {status === "loading" && (
            <Loader2 className="h-16 w-16 text-emerald-500 animate-spin" />
          )}
          {status === "success" && (
            <CheckCircle2 className="h-16 w-16 text-emerald-500" />
          )}
          {status === "error" && (
            <XCircle className="h-16 w-16 text-destructive" />
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {status === "success" && (
            <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
              <Link href="/login">Go to Login</Link>
            </Button>
          )}
          {status === "error" && (
            <Button asChild variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50">
              <Link href="/register">Back to Register</Link>
            </Button>
          )}
          <p className="text-xs text-center text-muted-foreground">
            Property Portal &copy; {new Date().getFullYear()}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 text-emerald-500 animate-spin" />
        <p className="mt-4 text-emerald-700 font-medium">Loading verification...</p>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
