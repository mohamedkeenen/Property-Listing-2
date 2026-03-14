"use client";

import { useFormContext } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Globe, GraduationCap, Building2, House } from "lucide-react";
import Image from "next/image";

interface PortalCardProps {
  id: string;
  title: string;
  logoBg: string;
  logoContent: React.ReactNode;
  enabled: boolean;
  onEnabledChange: (val: boolean) => void;
  children?: React.ReactNode;
}

const PortalCard = ({ id, title, logoBg, logoContent, enabled, onEnabledChange, children }: PortalCardProps) => (
  <Card className={cn(
    "relative overflow-hidden transition-all duration-500 border border-border/40",
    enabled 
      ? "bg-card shadow-xl shadow-primary/5 border-primary/20 ring-1 ring-primary/10" 
      : "bg-muted/30 grayscale-[0.8] opacity-60 hover:opacity-80 transition-opacity"
  )}>
    <CardContent className="p-8">
      <div className="flex items-start gap-6">
        <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center shadow-sm shrink-0", logoBg)}>
          {logoContent}
        </div>
        <div className="flex-1 pt-3">
          <h4 className="text-sm font-bold text-foreground tracking-tight">{title}</h4>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-10">
        <div className="flex items-center gap-4">
          {children}
        </div>
        <div className="flex items-center gap-3">
          <Switch 
            checked={enabled} 
            onCheckedChange={onEnabledChange} 
            className="data-[state=checked]:bg-primary"
          />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mr-1">Enable</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

export function PortalSelectionStep() {
  const { watch, setValue } = useFormContext();
  const portals = watch("portals") || {
    propertyFinder: false,
    bayutEnabled: false,
    bayutSelection: false,
    dubizzleSelection: false,
    officeWebsite: false,
    primeZamWebsite: false,
  };

  const setPortal = (key: string, val: boolean) => {
    setValue("portals", { ...portals, [key]: val }, { shouldValidate: true });
  };

  return (
    <div className="space-y-10 py-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Skyloov Card */}
        <PortalCard
          id="skyloov"
          title="Skyloov"
          logoBg="bg-white"
          logoContent={
            <div className="relative w-full h-full flex items-center justify-center p-2">
               <img src="https://res.cloudinary.com/devht0mp5/image/upload/v1773486432/Logo-rebrand-blue_dwxrba.svg" alt="Skyloov" className="w-full h-full object-contain" />
            </div>
          }
          enabled={false}
          onEnabledChange={() => {}}
        >
          <div className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[8px] font-black tracking-widest uppercase">
            Coming Soon
          </div>
        </PortalCard>

        {/* Property Finder Card */}
        <PortalCard
          id="pf"
          title="Property Finder"
          logoBg="bg-white"
          logoContent={
            <div className="relative w-full h-full flex items-center justify-center p-2">
               <img src="https://res.cloudinary.com/devht0mp5/image/upload/v1772105511/PF_ljkahc.png" alt="Property Finder" className="w-full h-full object-contain" />
            </div>
          }
          enabled={portals.propertyFinder}
          onEnabledChange={(v) => setPortal("propertyFinder", v)}
        />

        {/* Bayut Card */}
        <PortalCard
          id="bayut"
          title="Bayut"
          logoBg="bg-white"
          logoContent={
             <div className="relative w-full h-full flex items-center justify-center p-2">
                <img src="https://res.cloudinary.com/devht0mp5/image/upload/v1772105511/bayut_gy4ev2.png" alt="Bayut" className="w-full h-full object-contain" />
             </div>
          }
          enabled={portals.bayutEnabled}
          onEnabledChange={(v) => setPortal("bayutEnabled", v)}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setPortal("bayutSelection", !portals.bayutSelection)}>
              <Checkbox checked={portals.bayutSelection} id="bayut-check" className="rounded-md border-border/60" />
              <label className="text-[10px] font-bold text-muted-foreground group-hover:text-foreground cursor-pointer transition-colors">Bayut</label>
            </div>
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setPortal("dubizzleSelection", !portals.dubizzleSelection)}>
              <Checkbox checked={portals.dubizzleSelection} id="dubizzle-check" className="rounded-md border-border/60" />
              <label className="text-[10px] font-bold text-muted-foreground group-hover:text-foreground cursor-pointer transition-colors">Dubizzle</label>
            </div>
          </div>
        </PortalCard>

        {/* Office Website Card */}
        <PortalCard
          id="office"
          title="Office Website"
          logoBg="bg-white"
          logoContent={
            <div className="relative w-full h-full flex items-center justify-center p-2">
               <img src="https://res.cloudinary.com/devht0mp5/image/upload/v1772529258/web_xgqvbi.png" alt="Office Website" className="w-full h-full object-contain" />
            </div>
          }
          enabled={portals.officeWebsite}
          onEnabledChange={(v) => setPortal("officeWebsite", v)}
        />

      </div>
    </div>
  );
}
