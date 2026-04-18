"use client";

import { MapPin, ArrowLeft } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export function LocationMap({ location }: { location: string }) {
  const { theme } = useTheme();
  const mapStyle = theme === "dark" ? "dark-v10" : "light-v10";

  return (
    <div className="relative aspect-video rounded-3xl md:rounded-[2.5rem] overflow-hidden group shadow-xl border border-border bg-muted">
      <div 
        className={cn(
          "absolute inset-0 bg-cover bg-center transition-all duration-1000 group-hover:scale-105",
          theme === "dark" ? "brightness-75 contrast-125" : "brightness-105"
        )}
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1582470754257-87635c24e867?q=80&w=1600&auto=format&fit=crop')` }}
      />
      
      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative group/pin">
          <div className="absolute -inset-4 bg-orange-500/20 rounded-full animate-ping duration-2000" />
          <div className="relative h-12 w-12 bg-white rounded-2xl shadow-2xl flex items-center justify-center border border-orange-500/20 transform -translate-y-2 group-hover:-translate-y-4 transition-transform duration-500">
            <MapPin className="h-6 w-6 text-orange-500 fill-orange-500/10" />
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/20 blur-[2px] rounded-full scale-x-150" />
        </div>
      </div>

      {/* Map Branding/Label - Floating */}
      <div className="absolute top-6 left-6 flex items-center gap-3">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest drop-shadow-sm">Direct Location Access</span>
        </div>
      </div>
    </div>
  );
}
