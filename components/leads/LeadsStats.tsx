import { cn } from "@/lib/utils";
import { 
  Users as LucideUsers, 
  UserPlus as LucideUserPlus, 
  UserCheck as LucideUserCheck, 
  UserX as LucideUserX, 
  Info as LucideInfo 
} from "lucide-react";

interface LeadsStatsProps {
  stats: {
    total: number;
    new: number;
    qualified: number;
    lost: number;
  };
}

export function LeadsStats({ stats }: LeadsStatsProps) {
  const statsCards = [
    { label: "Total Database", value: stats.total, icon: LucideUsers, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
    { label: "New Leads", value: stats.new, icon: LucideUserPlus, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Qualified", value: stats.qualified, icon: LucideUserCheck, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { label: "Lost Leads", value: stats.lost, icon: LucideUserX, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
  ];

  return (
    <div className="shrink-0 space-y-6 mb-10">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10 text-primary relative ring-1 ring-primary/20">
          <LucideUsers className="h-5 w-5" />
        </div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/80">Global System Statistics</h3>
        <div className="h-px flex-1 bg-border/40" />
        <span className="text-muted-foreground/40"><LucideInfo className="h-4 w-4" /></span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsCards.map((s) => (
          <div 
            key={s.label} 
            className={cn(
              "relative bg-card rounded-xl border-2 transition-all duration-300 overflow-hidden p-6",
              s.border
            )}
          >
            <div className="flex items-center justify-between mb-5">
              <div className={cn("p-3 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg", s.bg)}>
                <s.icon className={cn("h-6 w-6", s.color)} />
              </div>
              <div className={cn("h-3 w-3 rounded-full bg-current", s.color)} />
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-black text-foreground tracking-tight tabular-nums">
                  {s.value?.toLocaleString() || 0}
              </div>
              <p className="text-[11px] text-muted-foreground font-black uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
