"use client";

import { BedDouble, Bath, Maximize, Car } from "lucide-react";

interface QuickInfoCardsProps {
  bedrooms: number;
  bathrooms: number;
  size: number;
  parking: string | number;
}

export function QuickInfoCards({ bedrooms, bathrooms, size, parking }: QuickInfoCardsProps) {
  const specs = [
    { label: "Bedrooms", val: bedrooms, icon: BedDouble, bg: "bg-orange-50", iconColor: "text-orange-500" },
    { label: "Bathrooms", val: bathrooms, icon: Bath, bg: "bg-blue-50", iconColor: "text-blue-500" },
    { label: "Area", val: `${size.toLocaleString()} SQFT`, icon: Maximize, bg: "bg-emerald-50", iconColor: "text-emerald-500" },
    { label: "Parking", val: parking || "1", icon: Car, bg: "bg-slate-50", iconColor: "text-slate-500" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {specs.map((spec, i) => (
        <div key={i} className="bg-card backdrop-blur-xl border border-border rounded-4xl px-6 py-4 flex items-center gap-5 shadow-sm hover:bg-muted/50 transition-all">
          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${spec.bg.replace('bg-', 'bg-')}/10`}>
            <spec.icon className={`h-7 w-7 ${spec.iconColor}`} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest truncate">{spec.label}</span>
            <span className="text-xl font-black text-foreground truncate">{spec.val}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
