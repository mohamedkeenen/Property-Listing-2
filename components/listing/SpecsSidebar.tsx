import { Building2, Hash, Calendar, Clock, Globe } from "lucide-react";
import { formatRelativeTime, cn } from "@/lib/utils";

interface SpecsSidebarProps {
  category: string;
  status: string;
  type: string;
  purpose: string;
  updatedAt: string;
  portals?: {
    bitrix?: boolean;
    website?: boolean;
    pf?: boolean;
    bayut?: boolean;
    dubizzle?: boolean;
    propqa?: boolean;
  };
}

export function SpecsSidebar({ category, status, type, purpose, updatedAt, portals }: SpecsSidebarProps) {
  const specs = [
    { label: "Category", val: category, icon: Building2 },
    { label: "Status", val: status, icon: Globe, isStatus: true },
    { label: "Type", val: type, icon: Hash },
    { label: "Purpose", val: purpose, icon: Calendar },
    { label: "Refreshed", val: formatRelativeTime(updatedAt), icon: Clock },
  ];

  return (
    <div className="space-y-10">
      <div className="bg-card backdrop-blur-3xl border border-border rounded-xl px-4 lg:px-6 py-5 space-y-6 lg:space-y-8 shadow-sm hover:bg-muted/50 transition-all">
        <h3 className="text-xs lg:text-sm font-black text-foreground uppercase tracking-[0.2em]">Digital Specifications</h3>
        <div className="space-y-6">
          {specs.map((s, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <s.icon className="h-4.5 w-4.5 text-primary" />
                <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">{s.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {s.isStatus && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                <span className="text-[11px] font-black text-foreground uppercase tracking-tight">{s.val}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 lg:pt-8 space-y-4 lg:space-y-6 border-t border-border/50">
          <p className="text-[9px] lg:text-[10px] font-black text-muted-foreground uppercase tracking-widest">Gateway Status</p>
          <div className="flex flex-wrap items-center gap-3">
            {[
              { id: 'bitrix', name: 'BITRIX', active: portals?.bitrix, color: '#2FC6F6', icon: 'https://res.cloudinary.com/devht0mp5/image/upload/v1775823210/download_1_eswdk2.png' },
              { id: 'website', name: 'WEBSITE', active: portals?.website, color: '#3B82F6', icon: 'https://res.cloudinary.com/devht0mp5/image/upload/v1772529258/web_xgqvbi.png' },
              { id: 'pf', name: 'PF', active: portals?.pf, color: '#EE2D37', icon: 'https://res.cloudinary.com/devht0mp5/image/upload/v1772105511/PF_ljkahc.png' },
              { id: 'bayut', name: 'BAYUT', active: portals?.bayut, color: '#2ABB66', icon: 'https://res.cloudinary.com/devht0mp5/image/upload/v1772105511/bayut_gy4ev2.png' },
              { id: 'dubizzle', name: 'DUBIZZLE', active: portals?.dubizzle, color: '#2ABB66', icon: 'https://res.cloudinary.com/devht0mp5/image/upload/v1775823210/download_gzle7f.png' },
              { id: 'propqa', name: 'PROPQA', active: portals?.propqa, color: '#F97316', icon: 'https://res.cloudinary.com/devht0mp5/image/upload/v1777361218/logo-header-white.QoQUc6PB_ao5mn9.svg' },
            ].map((portal) => (
              <div key={portal.id} className="flex flex-col items-center gap-2 min-w-0">
                <div 
                  className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-500 border relative overflow-hidden shrink-0",
                    portal.active 
                      ? "border-transparent shadow-lg text-white" 
                      : "bg-muted border-border/50 grayscale opacity-20"
                  )}
                  style={{ backgroundColor: portal.active ? portal.color : undefined }}
                >
                  <img 
                    src={portal.icon} 
                    alt={portal.name} 
                    className={cn(
                      "h-4.5 w-4.5 object-contain transition-all", 
                      portal.active ? "contrast-110" : "opacity-50",
                      portal.id === 'website' && portal.active && "brightness-0 invert"
                    )}
                  />
                  {portal.active && <div className="absolute inset-0 bg-linear-to-tr from-white/20 to-transparent pointer-events-none" />}
                </div>
                <span className={cn(
                  "text-[9px] font-black tracking-widest transition-colors text-center truncate px-1",
                  portal.active ? "text-foreground" : "text-muted-foreground/50"
                )}>
                  {portal.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
