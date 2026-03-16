"use client";

import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Side: Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 text-white relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          
          <div className="absolute inset-0 bg-primary" />
        </div>
        
        <div className="relative z-10 flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="transition-transform duration-500 hover:scale-105">
            <Image 
              src="https://res.cloudinary.com/devht0mp5/image/upload/v1771906074/logoo_hsovz7.jpg"
              alt="Keen Enterprises"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <span className="text-3xl font-black tracking-tight uppercase">Keen</span>
        </div>

        <div className="relative z-10 space-y-6 flex flex-col">
          <div className="space-y-4 max-w-lg">
            <h1 className="text-6xl font-black leading-tight tracking-tight drop-shadow-sm">
              Welcome to<br />Keen Enterprises
            </h1>
            <p className="text-white/80 text-xl font-medium drop-shadow-md mx-auto">
              Elevate your property management with the most advanced dashboard in real estate.
            </p>
          </div>
          
          {/* Pagination Indicators */}
          <div className="flex gap-2">
            <div className="h-2 w-8 rounded-full bg-white shadow-lg transition-all cursor-pointer" />
            <div className="h-2 w-2 rounded-full bg-white/40 hover:bg-white/60 transition-all cursor-pointer" />
            <div className="h-2 w-2 rounded-full bg-white/40 hover:bg-white/60 transition-all cursor-pointer" />
          </div>
        </div>

        {/* Footer Section */}
        <div className="relative z-10 text-center lg:text-left">
          <p className="text-white/70 text-sm font-bold drop-shadow-sm">
            © 2026 Keen Enterprises. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Side: Auth Forms */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center items-center p-6 md:p-12 relative overflow-y-auto">
        <div className="w-full max-w-[440px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </div>
    </div>
  );
}
