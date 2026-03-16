"use client";

import { useState } from "react";
import { Mail, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModernField } from "@/components/ui/modern-field";
import Link from "next/link";
import Image from "next/image";

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/otp";
    }, 1500);
  };

  return (
    <div className="space-y-8 py-10">
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

      <div className="space-y-4 text-center">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-xs font-black text-muted-foreground hover:text-primary transition-all uppercase tracking-widest"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Sign In
        </Link>
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-foreground underline decoration-primary decoration-4 underline-offset-8 mx-auto w-fit">Reset Password</h1>
          <p className="text-muted-foreground font-medium pt-4">Enter your email and we'll send you an OTP code</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <ModernField
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          icon={Mail}
          required
        />

        <Button 
          type="submit" 
          size="lg"
          className="w-full h-14 rounded-xl text-md font-black shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-[0.98]"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Sending...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              <span>Send OTP Code</span>
            </div>
          )}
        </Button>
      </form>
    </div>
  );
}
