"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModernField } from "@/components/ui/modern-field";
import Link from "next/link";
import Image from "next/image";
import { useLoginMutation } from "@/api/redux/services/authApi";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@/api/redux/slices/authSlice";
import { selectCompanyName, selectCompanyLogo } from "@/api/redux/slices/settingsSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginValues } from "@/validation/authSchema";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();
  const companyName = useSelector(selectCompanyName);
  const companyLogo = useSelector(selectCompanyLogo);

  const getLogoUrl = (logo: string) => {
    if (!logo) return null;
    if (logo.startsWith('http') || logo.startsWith('data:image')) return logo;
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://property-listing.keenenter.com/api').replace('/api', '');
    return `${apiUrl}/storage/${logo}`;
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginValues) => {
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials({ 
        user: result.data.user, 
        token: result.data.token 
      }));
      toast.success("Welcome back!");
      router.push("/");
    } catch (error: any) {
      const message = error?.data?.message || "Login failed. Please check your credentials.";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Mobile Logo (Visible only on mobile) */}
      <div className="lg:hidden flex flex-col items-center gap-4 mb-8">
        {getLogoUrl(companyLogo) && (
          <Image 
            src={getLogoUrl(companyLogo)!}
            alt={companyName}
            width={120}
            height={120}
            className="object-contain"
            unoptimized={companyLogo.startsWith('data:image')}
          />
        )}
        <h2 className="text-3xl font-black text-foreground uppercase tracking-tight text-center">{companyName}</h2>
      </div>

      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-black tracking-tight text-foreground underline decoration-primary decoration-4 underline-offset-8 mx-auto w-fit">Sign In</h1>
        <p className="text-muted-foreground font-medium pt-4">Enter your credentials to access your dashboard</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <ModernField
            label="Email Address"
            type="email"
            placeholder="name@company.com"
            icon={Mail}
            required
            {...register("email")}
            value={watch("email")}
            error={errors.email?.message}
          />

          <div className="relative">
            <ModernField
              label="Password"
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
            <div className="flex justify-end mt-2">
              <Link 
                href="/forgot-password" 
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
