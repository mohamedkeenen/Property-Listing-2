"use client";

import { useState, useRef, useEffect } from "react";
import { ShieldCheck, ArrowRight, RefreshCw, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function OTPForm() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

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
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/new-password";
    }, 1500);
  };

  return (
    <div className="space-y-8 py-10">
      {/* Mobile Logo */}
      <div className="lg:hidden flex flex-col items-center gap-4 mb-8">
        <Image 
          src="https://res.cloudinary.com/devht0mp5/image/upload/v1771906074/logoo_hsovz7.jpg"
          alt="Keen Enterprises"
          width={64}
          height={64}
          className="object-contain"
        />
        <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Keen Enterprises</h2>
      </div>

      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-black tracking-tight text-foreground underline decoration-primary decoration-4 underline-offset-8 mx-auto w-fit">Verify Account</h1>
        <p className="text-muted-foreground font-medium flex items-center justify-center gap-2 pt-4">
          We sent a 6-digit code to <span className="text-foreground font-bold underline decoration-primary/30">ss@gmail.com</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
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
              className="w-full h-14 sm:h-16 text-center text-2xl font-black rounded-xl border-2 border-border bg-card focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
            />
          ))}
        </div>

        <div className="space-y-4">
          <Button 
            type="submit" 
            size="lg"
            className="w-full h-14 rounded-xl text-md font-black shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-[0.98]"
            disabled={isLoading || otp.join("").length < 6}
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
            className="w-full h-12 rounded-xl text-sm font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-2" />
            Resend Code
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
