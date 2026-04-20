"use client";

import { useFormContext } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
    "relative overflow-hidden transition-all duration-500 border border-border/40 rounded-4xl",
    enabled 
      ? "bg-card shadow-2xl shadow-primary/5 border-primary/20 ring-1 ring-primary/10" 
      : "bg-muted/30 grayscale-[0.8] opacity-60 hover:opacity-80 transition-opacity"
  )}>
    <CardContent className="p-8">
      <div className="flex items-start gap-6">
        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm shrink-0", logoBg)}>
          {logoContent}
        </div>
        <div className="flex-1 pt-4">
          <h4 className="text-base font-black text-foreground tracking-tight">{title}</h4>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-12">
        <div className="flex items-center gap-4">
          {children}
        </div>
        <div className="flex items-center gap-4">
          <Switch 
            checked={enabled} 
            onCheckedChange={onEnabledChange} 
            className="data-[state=checked]:bg-primary scale-125"
          />
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground">Enable</span>
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
    const updatedPortals = { ...portals, [key]: val };
    
    // Logic for Bayut/Dubizzle sync
    if (key === 'bayutSelection' || key === 'dubizzleSelection') {
      if (val) {
        updatedPortals.bayutEnabled = true;
      } else if (!updatedPortals.bayutSelection && !updatedPortals.dubizzleSelection) {
        updatedPortals.bayutEnabled = false;
      }
    }

    if (key === 'bayutEnabled' && !val) {
      updatedPortals.bayutSelection = false;
      updatedPortals.dubizzleSelection = false;
    }

    setValue("portals", updatedPortals, { shouldValidate: true });
  };

  return (
    <div className="space-y-10 py-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <img src="/bayut-green.png" alt="Bayut" className="w-full h-full object-contain" onError={(e) => {
                  e.currentTarget.src = "https://res.cloudinary.com/devht0mp5/image/upload/v1772105511/bayut_gy4ev2.png"
                }} />
             </div>
          }
          enabled={portals.bayutEnabled}
          onEnabledChange={(v) => setPortal("bayutEnabled", v)}
        >
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setPortal("bayutSelection", !portals.bayutSelection)}>
              <div className={cn(
                "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all",
                portals.bayutSelection ? "border-primary bg-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]" : "border-border/60"
              )}>
                 {portals.bayutSelection && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
              <label className="text-[11px] font-bold text-foreground cursor-pointer select-none">Bayut</label>
            </div>
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setPortal("dubizzleSelection", !portals.dubizzleSelection)}>
              <div className={cn(
                "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all",
                portals.dubizzleSelection ? "border-primary bg-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]" : "border-border/60"
              )}>
                 {portals.dubizzleSelection && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
              <label className="text-[11px] font-bold text-foreground cursor-pointer select-none">Dubizzle</label>
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
