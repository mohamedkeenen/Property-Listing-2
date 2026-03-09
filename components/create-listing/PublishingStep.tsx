import { UseFormReturn } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Globe, Home, Building2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
    lightColor: "bg-red-50 text-red-600 border-red-100"
  },
  { 
    key: "portalBayut", 
    label: "Bayut & Dubizzle", 
    description: "Reach millions of buyers on Bayut and Dubizzle platforms.", 
    icon: Building2, 
    color: "bg-orange-500",
    lightColor: "bg-orange-50 text-orange-600 border-orange-100"
  },
  { 
    key: "portalWebsite", 
    label: "Office Website", 
    description: "Showcase this property on your official agency website.", 
    icon: Globe, 
    color: "bg-blue-500",
    lightColor: "bg-blue-50 text-blue-600 border-blue-100"
  },
];

export function PublishingStep({ form }: Props) {
  const { watch, setValue } = form;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {portals.map((portal) => {
        const isEnabled = !!watch(portal.key);
        return (
          <Card 
            key={portal.key}
            className={cn(
              "rounded-3xl transition-all duration-300 border-border/50 shadow-lg overflow-hidden relative group",
              isEnabled ? "ring-2 ring-primary bg-primary/2" : "hover:shadow-xl hover:border-primary/20"
            )}
          >
            <CardContent className="p-0">
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className={cn("p-3 rounded-2xl shadow-sm border", portal.lightColor)}>
                    <portal.icon className="h-6 w-6" />
                  </div>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={(v) => setValue(portal.key, v)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-800 tracking-tight">{portal.label}</h3>
                    {isEnabled && <CheckCircle2 className="h-4 w-4 text-primary animate-in zoom-in duration-300" />}
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {portal.description}
                  </p>
                </div>

                <div className={cn(
                  "p-3 rounded-xl border border-dashed flex items-center justify-between transition-colors",
                  isEnabled ? "border-primary/30 bg-primary/5" : "border-slate-100 bg-slate-50/50"
                )}>
                  <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Status</span>
                  <span className={cn(
                    "text-xs font-bold",
                    isEnabled ? "text-primary" : "text-slate-400"
                  )}>
                    {isEnabled ? "READY TO SYNC" : "IDLE"}
                  </span>
                </div>
              </div>
              
              {/* Bottom decorative bar */}
              <div className={cn(
                "h-1.5 w-full transition-colors",
                isEnabled ? portal.color : "bg-slate-100"
              )} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
