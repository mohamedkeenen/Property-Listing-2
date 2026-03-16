"use client";

import { useState, useRef } from "react";
import { Mail, Lock, User, Building2, Phone, Camera, UserPlus, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModernField } from "@/components/ui/modern-field";
import Link from "next/link";
import Image from "next/image";
import { getFlagFromPhone } from "@/lib/country-flags";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mimic account creation and setting "auth" flag
    setTimeout(() => {
      localStorage.setItem("auth_session", "true");
      setIsLoading(false);
      window.location.href = "/";
    }, 2000);
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
          width={64}
          height={64}
          className="object-contain"
        />
        <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Keen Enterprises</h2>
      </div>

      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-black tracking-tight text-foreground underline decoration-primary decoration-4 underline-offset-8 mx-auto w-fit">Create Account</h1>
        <p className="text-muted-foreground font-medium pt-4">Set up your business profile</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
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
          <ModernField label="Full Name" icon={User} required placeholder="John Doe" />
          <ModernField label="Email" type="email" icon={Mail} required placeholder="name@company.com" />
          <ModernField 
            label="Phone" 
            type="tel" 
            icon={Phone} 
            placeholder="+20 123 456 7890" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            flag={getFlagFromPhone(phone)}
          />
          <ModernField label="Company Name" icon={Building2} placeholder="Keen Enterprises" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
            </div>
            <div className="relative">
              <ModernField
                label="Confirm"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                icon={Lock}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-[50%] -translate-y-[50%] text-muted-foreground hover:text-primary transition-colors p-1"
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

      <div className="text-center">
        <p className="text-sm font-medium text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-black hover:underline underline-offset-4">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
