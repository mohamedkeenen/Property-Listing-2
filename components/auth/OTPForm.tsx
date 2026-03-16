"use client";

import { useState, useRef, useEffect } from "react";
import { ShieldCheck, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useVerifyOtpMutation, useResendOtpMutation } from "@/api/redux/services/authApi";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function OTPForm() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";

  const handleResend = async () => {
    try {
      await resendOtp({ email }).unwrap();
      toast.success("OTP code resent!");
      setError(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to resend OTP.");
    }
  };

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setError(null);

    // Focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    
    if (otpCode.length < 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }
    
    try {
      await verifyOtp({ email, otp: otpCode }).unwrap();
      toast.success("OTP verified successfully!");
      router.push(`/new-password?email=${email}&token=${otpCode}`);
    } catch (error: any) {
      const message = error?.data?.message || "Invalid OTP. Please try again.";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="space-y-8 py-10">
      {/* Mobile Logo */}
      <div className="lg:hidden flex flex-col items-center gap-4 mb-8">
        <Image 
          src="https://res.cloudinary.com/devht0mp5/image/upload/v1771906074/logoo_hsovz7.jpg"
          alt="Keen Enterprises"
          width={120}
          height={120}
          className="object-contain"
        />
        <h2 className="text-3xl font-black text-foreground uppercase tracking-tight">Keen Enterprises</h2>
      </div>

      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-black tracking-tight text-foreground underline decoration-primary decoration-4 underline-offset-8 mx-auto w-fit">Verify Account</h1>
        <p className="text-muted-foreground font-medium flex items-center justify-center gap-2 pt-4">
          We sent a 6-digit code to <span className="text-foreground font-bold underline decoration-primary/30">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-4">
          <div className="flex justify-between gap-2 sm:gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                ref={(el) => (inputRefs.current[index] = el) as any}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={cn(
                  "w-full h-14 sm:h-16 text-center text-2xl font-black rounded-xl border-2 bg-card outline-none transition-all",
                  error ? "border-destructive ring-4 ring-destructive/5" : "border-border focus:border-primary focus:ring-4 focus:ring-primary/5"
                )}
              />
            ))}
          </div>
          {error && (
            <div className="flex items-center justify-center gap-2 text-destructive text-xs font-bold animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Button 
            type="submit" 
            size="lg"
            className="w-full h-14 rounded-xl text-md font-black shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-[0.98]"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Verify Account</span>
              </div>
            )}
          </Button>

          <Button 
            type="button"
            variant="ghost"
            onClick={handleResend}
            disabled={isResending}
            className="w-full h-12 rounded-xl text-sm font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
          >
            <RefreshCw className={cn("h-3.5 w-3.5 mr-2", isResending && "animate-spin")} />
            {isResending ? "Resending..." : "Resend Code"}
          </Button>
        </div>
      </form>

      <div className="text-center">
         <Link href="/login" className="text-sm font-bold text-muted-foreground hover:text-primary transition-all flex items-center justify-center gap-2">
            Return to Sign In
         </Link>
      </div>
    </div>
  );
}
