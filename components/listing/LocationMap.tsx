"use client";

import { MapPin, ArrowLeft } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export function LocationMap({ location }: { location: string }) {
  const { theme } = useTheme();

  const encodedLocation = encodeURIComponent(location);
  const mapUrl = `https://maps.google.com/maps?q=${encodedLocation}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="relative aspect-video rounded-xl overflow-hidden group shadow-xl border border-border bg-muted/20">
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={mapUrl}
        className="w-full h-full transition-opacity duration-700 hover:brightness-105"
      />
      
      {/* Floating Design Badge */}
      <div className="absolute top-4 left-4 flex items-center gap-3 pointer-events-none">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2.5">
          <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Property Neighborhood</span>
        </div>
      </div>
    </div>
  );
}
