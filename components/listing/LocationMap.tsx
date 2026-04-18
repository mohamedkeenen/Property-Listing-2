"use client";

import { MapPin, ArrowLeft } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export function LocationMap({ location }: { location: string }) {
  const { theme } = useTheme();
  const mapStyle = theme === "dark" ? "dark-v10" : "light-v10";

  return (
    <div className="bg-card backdrop-blur-3xl border border-border rounded-[2.5rem] p-10 space-y-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shadow-sm text-orange-500">
            <MapPin className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-black text-foreground tracking-tight">Location Map</h3>
        </div>
        <button className="flex items-center gap-2 text-xs font-black text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors group">
          View on Map
          <ArrowLeft className="h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      <div className="relative aspect-21/9 rounded-4xl overflow-hidden border border-border bg-muted shadow-inner">
        <div 
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-all duration-1000",
            theme === "dark" ? "grayscale opacity-40 contrast-150" : "opacity-80"
          )}
          style={{ backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/${mapStyle}/static/55.27,25.20,13,0,0/1200x500?access_token=pk.placeholder')` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-background/60 backdrop-blur-md px-6 py-3 rounded-2xl shadow-2xl border border-border flex items-center gap-3">
                <MapPin className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-black text-foreground uppercase tracking-tight">Property Location</span>
            </div>
        </div>
      </div>
    </div>
  );
}
