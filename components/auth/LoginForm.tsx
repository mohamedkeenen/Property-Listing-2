"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModernField } from "@/components/ui/modern-field";
import Link from "next/link";
import Image from "next/image";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mimic login delay
    setTimeout(() => {
      localStorage.setItem("auth_session", "true");
      setIsLoading(false);
      window.location.href = "/";
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Mobile Logo (Visible only on mobile) */}
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
        <h1 className="text-4xl font-black tracking-tight text-foreground underline decoration-primary decoration-4 underline-offset-8 mx-auto w-fit">Sign In</h1>
        <p className="text-muted-foreground font-medium pt-4">Enter your credentials to access your dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <ModernField
            label="Email Address"
            type="email"
            placeholder="name@company.com"
            icon={Mail}
            required
          />

          <div className="relative">
            <ModernField
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              icon={Lock}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[50%] -translate-y-[50%] text-muted-foreground hover:text-primary transition-colors p-1"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <div className="flex justify-end mt-2">
              <Link 
                href="/reset-password" 
                className="text-xs font-bold text-primary hover:underline hover:text-primary/80 transition-all"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          size="lg"
          className="w-full h-14 rounded-xl text-md font-black shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-[0.98]"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Signing In...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span>Sign In</span>
            </div>
          )}
        </Button>
      </form>

      <div className="text-center pt-2">
        <p className="text-sm font-medium text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary font-black hover:underline underline-offset-4">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
