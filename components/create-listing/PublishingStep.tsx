import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Globe, Home, Building2, CheckCircle2, Info, StickyNote, FileText, Upload, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef } from "react";

interface Props {
  form: UseFormReturn<any>;
}

const portals = [
  {
    key: "portalPF",
    label: "Property Finder",
    description: "Publish your listing to Property Finder with real-time sync.",
    icon: Home,
    color: "bg-red-500",
    lightColor: "bg-red-500/10 text-red-500 border-red-500/20"
  },
  {
    key: "portalBayut",
    label: "Bayut & Dubizzle",
    description: "Reach millions of buyers on Bayut and Dubizzle platforms.",
    icon: Building2,
    color: "bg-orange-500",
    lightColor: "bg-orange-500/10 text-orange-500 border-orange-500/20"
  },
  {
    key: "portalWebsite",
    label: "Office Website",
    description: "Showcase this property on your official agency website.",
    icon: Globe,
    color: "bg-blue-500",
    lightColor: "bg-blue-500/10 text-blue-500 border-blue-500/20"
  },
];

export function PublishingStep({ form }: Props) {
  const { watch, setValue } = form;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Select Outlets</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portals.map((portal) => {
          const isEnabled = !!watch(portal.key);
          return (
            <Card
              key={portal.key}
              className={cn(
                "rounded-4xl transition-all duration-500 border-border shadow-xl hover:shadow-2xl overflow-hidden relative group bg-background/50 backdrop-blur-sm",
                isEnabled ? "ring-2 ring-primary/50 bg-primary/5 border-primary/20" : "hover:border-primary/20"
              )}
            >
              <CardContent className="p-0">
                <div className="p-7 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className={cn("p-4 rounded-2xl shadow-lg border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3", portal.lightColor)}>
                      <portal.icon className="h-7 w-7" />
                    </div>
                    <div className="pt-2">
                      <Switch
                        checked={isEnabled}
                        onCheckedChange={(v) => setValue(portal.key, v)}
                        className="data-[state=checked]:bg-primary scale-125"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-foreground text-lg tracking-tight">{portal.label}</h3>
                      {isEnabled && <CheckCircle2 className="h-5 w-5 text-primary animate-in zoom-in duration-500" />}
                    </div>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                      {portal.description}
                    </p>
                  </div>

                  <div className={cn(
                    "p-4 rounded-2xl border border-dashed flex items-center justify-between transition-all duration-500",
                    isEnabled ? "border-primary/30 bg-primary/10" : "border-border bg-muted/50"
                  )}>
                    <span className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Sync Status</span>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                      isEnabled ? "text-primary bg-primary/10" : "text-muted-foreground bg-muted"
                    )}>
                      {isEnabled ? "ACTIVE" : "DISABLED"}
                    </span>
                  </div>
                </div>

                {/* Bottom decorative bar */}
                <div className={cn(
                  "h-1.5 w-full transition-all duration-700",
                  isEnabled ? portal.color : "bg-muted shadow-inner"
                )} />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="p-6 rounded-3xl bg-muted/30 border border-border/50 flex items-center gap-4">
         <div className="h-10 w-10 rounded-2xl bg-background flex items-center justify-center shrink-0 shadow-sm border border-border">
            <Info className="h-5 w-5 text-primary" />
         </div>
         <p className="text-[11px] font-medium text-muted-foreground">
           Properties are usually synced within <span className="text-foreground font-bold">15-30 minutes</span> across all selected platforms after final publication.
         </p>
      </div>
    </div>
  );
}
