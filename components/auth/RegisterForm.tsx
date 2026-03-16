"use client";

import { useState, useRef } from "react";
import { Mail, Lock, User, Building2, Phone, Camera, UserPlus, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModernField } from "@/components/ui/modern-field";
import Link from "next/link";
import Image from "next/image";
import { getFlagFromPhone } from "@/lib/country-flags";
import { useRegisterMutation } from "@/api/redux/services/authApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterValues } from "@/validation/authSchema";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [register, { isLoading }] = useRegisterMutation();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      company_name: "",
      password: "",
      password_confirmation: "",
    },
  });

  const email = watch("email");
  const phone = watch("phone") || "";

  const onSubmit = async (data: RegisterValues) => {
    try {
      await register({
        ...data,
        photo: profileImage 
      }).unwrap();

      toast.success("Account created successfully! Please check your email to verify your account.");
      setIsSuccess(true);
    } catch (error: any) {
      const message = error?.data?.message || "Registration failed. Please try again.";
      toast.error(message);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
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
        <h1 className="text-4xl font-black tracking-tight text-foreground underline decoration-primary decoration-4 underline-offset-8 mx-auto w-fit">Create Account</h1>
        <p className="text-muted-foreground font-medium pt-4">Set up your business profile</p>
      </div>

      {isSuccess ? (
        <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-10 text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <Mail className="h-10 w-10 text-emerald-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-emerald-900">Check Your Email</h3>
            <p className="text-emerald-700 font-medium">
              We've sent a verification link to <span className="font-bold underline decoration-2">{email}</span>. 
              Please click the link to activate your account.
            </p>
          </div>
          <Button asChild variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-100">
            <Link href="/login">Return to Sign In</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Profile Photo Only */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-4">
               <div 
                onClick={handleImageClick}
                className="w-24 h-24 rounded-full bg-muted/30 border-2 border-dashed border-border flex items-center justify-center hover:border-primary hover:bg-primary/5 transition-all group relative overflow-hidden cursor-pointer shadow-inner"
               >
                  {profileImage ? (
                    <Image 
                      src={profileImage} 
                      alt="Profile Preview" 
                      fill 
                      className="object-cover animate-in fade-in zoom-in-50 duration-500"
                    />
                  ) : (
                    <Camera className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <Camera className="h-6 w-6 text-white" />
                  </div>
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Your Photo</span>
               <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
               />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5">
            <ModernField 
              label="Full Name" 
              icon={User} 
              required 
              placeholder="your name" 
              {...registerField("full_name")}
              value={watch("full_name")}
              error={errors.full_name?.message}
            />
            <ModernField 
              label="Email" 
              type="email" 
              icon={Mail} 
              required 
              placeholder="name@company.com" 
              {...registerField("email")}
              value={watch("email")}
              error={errors.email?.message}
            />
            <ModernField 
              label="Phone" 
              type="tel" 
              icon={Phone} 
              placeholder="+20 123 456 7890" 
              {...registerField("phone")}
              value={watch("phone")}
              error={errors.phone?.message}
              flag={getFlagFromPhone(phone)}
            />
            <ModernField 
              label="Company Name" 
              icon={Building2} 
              placeholder="Keen Enterprises" 
              {...registerField("company_name")}
              value={watch("company_name")}
              error={errors.company_name?.message}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <ModernField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  icon={Lock}
                  required
                  {...registerField("password")}
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
                  label="Confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  icon={Lock}
                  required
                  {...registerField("password_confirmation")}
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
                <span>Creating...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                <span>Create Account</span>
              </div>
            )}
          </Button>
        </form>
      )}

      {!isSuccess && (
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-black hover:underline underline-offset-4">
              Sign In
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
