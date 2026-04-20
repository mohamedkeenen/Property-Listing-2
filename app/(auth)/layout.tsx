"use client";

import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://res.cloudinary.com/devht0mp5/image/upload/v1775560867/aa60a293-5fca-4701-be95-482a083df410_pknio8.jpg"
            alt="City Background" 
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/20 to-black/70" />
        </div>

        <div className="relative z-10 flex flex-col items-start gap-2 animate-in fade-in slide-in-from-left-4 duration-700 mt-2">
          <div className="relative w-[200px] h-[100px]">
            <Image 
              src="https://res.cloudinary.com/devht0mp5/image/upload/v1771906074/logoo_hsovz7.jpg" 
              alt="KEEN Enterprises Logo" 
              fill
              className="object-contain"
            />
          </div>
          
          <div className="flex flex-col items-start">
            <span className="text-[3rem] font-black uppercase text-white drop-shadow-md leading-none tracking-tight">
              KEEN
            </span>
            <div className="border-b-[3px] border-white pb-1 mt-1">
              <span className="text-[2rem] font-bold text-white drop-shadow-md leading-none">
                Enterprises LLC.
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-4 flex flex-col mb-16 mt-auto">
          <h1 className="text-4xl lg:text-[2.75rem] font-bold leading-[1.2] drop-shadow-md animate-in fade-in slide-in-from-left-8 duration-700 text-white">
            Your Gateway to Premium<br />Properties
          </h1>
          <p className="text-white/90 text-lg font-medium max-w-lg drop-shadow-sm leading-relaxed animate-in fade-in slide-in-from-left-8 duration-700 delay-150">
            Discover, list, and manage properties across the region. Join thousands of agents and developers on the leading real estate portal.
          </p>
        </div>
        <div className="relative z-10 text-left pb-2 animate-in fade-in duration-1000 delay-300">
          <p className="text-white/70 text-sm drop-shadow-sm">
            © 2026 KEEN Enterprises LLC. All rights reserved.
          </p>
        </div>
      </div>

      <div className="w-full lg:flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative z-10 bg-white dark:bg-background">
        <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-6 duration-700 mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
