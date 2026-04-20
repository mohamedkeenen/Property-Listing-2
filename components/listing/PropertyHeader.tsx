"use client";

import { MapPin, Circle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyHeaderProps {
  title: string;
  price: number;
  location: string;
  reference: string;
  status: string;
  purpose: string;
  onBack: () => void;
}

export function PropertyHeader({
  title,
  price,
  location,
  reference,
  status,
  purpose,
  onBack
}: PropertyHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-2 px-2">
      <div className="flex items-center gap-6">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onBack}
          className="h-12 w-12 rounded-2xl border-border bg-card hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-90 shadow-sm group shrink-0"
        >
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
        </Button>

        <div className="flex items-center gap-4 min-w-0">
          <div className="h-12 w-12 rounded-full border border-orange-500/20 flex items-center justify-center bg-orange-500/10 shrink-0">
            <MapPin className="h-6 w-6 text-orange-500" />
          </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground uppercase">{title}</h1>
            <Circle className="h-2 w-2 fill-primary text-primary" />
          </div>
          <p className="text-xs font-bold text-muted-foreground tracking-wider">
            {reference} • {location.toUpperCase()}
          </p>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-6">
        <div className="bg-primary/10 px-6 py-3 rounded-full flex items-center gap-3 border border-primary/20 shadow-sm">
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">Price:</span>
          <span className="text-xl font-black text-primary">AED {price.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 px-5 py-2.5 rounded-full border border-emerald-500/20 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest">{status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
