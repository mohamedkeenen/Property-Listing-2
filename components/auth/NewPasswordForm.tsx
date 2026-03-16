"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModernField } from "@/components/ui/modern-field";
import Image from "next/image";
import { useResetPasswordMutation } from "@/api/redux/services/authApi";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordValues } from "@/validation/authSchema";

export function NewPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    try {
      await resetPassword({ 
        email, 
        otp: token, 
        ...data 
      }).unwrap();
      toast.success("Password updated successfully!");
      router.push("/login");
    } catch (error: any) {
      const message = error?.data?.message || "Failed to update password. Please try again.";
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
        <h1 className="text-4xl font-black tracking-tight text-foreground underline decoration-primary decoration-4 underline-offset-8 mx-auto w-fit">New Password</h1>
        <p className="text-muted-foreground font-medium pt-4">Set a secure password for your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <ModernField
              label="New Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              icon={Lock}
              required
              {...register("password")}
              value={watch("password")}
              error={errors.password?.message}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[24px] -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-1"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="relative">
            <ModernField
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              icon={Lock}
              required
              {...register("password_confirmation")}
              value={watch("password_confirmation")}
              error={errors.password_confirmation?.message}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-[24px] -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-1"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
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
              <span>Updating...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span>Update Password</span>
            </div>
          )}
        </Button>
      </form>
    </div>
  );
}
