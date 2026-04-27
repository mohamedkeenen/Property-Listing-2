"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotFoundUIProps {
  title?: string;
  message?: string;
  buttonText?: string;
  onAction?: () => void;
  showSearch?: boolean;
}

export function NotFoundUI({
  title = "Entry Not Found",
  message = "The requested page or record could not be found in our directory.",
  buttonText = "Return to Dashboard",
  onAction,
}: NotFoundUIProps) {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0A0C10]">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10 max-w-4xl w-full px-6 flex flex-col items-center text-center">
        {/* Large Company Logo */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-12 duration-1000">
          <div className="relative group">
             <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-150 opacity-50 group-hover:opacity-70 transition-opacity duration-1000" />
             <img 
               src="/logo.jpg" 
               alt="Company Logo" 
               className="relative z-10 w-64 md:w-96 h-auto object-contain drop-shadow-[0_0_30px_rgba(var(--primary),0.3)] hover:scale-105 transition-transform duration-700" 
             />
          </div>
        </div>

        {/* Big 404 Text */}
        <div className="mb-12 animate-in zoom-in-95 duration-1000 delay-300">
          <h1 className="text-8xl md:text-[12rem] font-black text-white/10 tracking-tighter leading-none select-none uppercase">
            404
          </h1>
          <p className="text-primary text-[10px] md:text-xs font-black uppercase tracking-[1em] -mt-8 rem] md:-mt-12 opacity-50">
            Resource Missing
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
          <Button 
            onClick={onAction || (() => router.push("/"))}
            className="w-full sm:w-auto h-16 px-12 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all gap-4 border-none"
          >
            <Home className="h-5 w-5" />
            {buttonText}
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => router.back()}
            className="w-full sm:w-auto h-16 px-12 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-95 transition-all gap-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
