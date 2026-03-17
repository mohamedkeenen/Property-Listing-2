"use client";

import { LeadsTable } from "@/components/leads/LeadsTable";
import { Lead } from "@/data/mockData";
import { Users, UserPlus, UserCheck, UserX, Info, List, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetLeadsQuery } from "@/api/redux/services/leadsApi";

export default function Leads() {
  const { data: apiLeads, isLoading: leadsLoading } = useGetLeadsQuery();
  // Remove mockLeads fallback to only show real data
  const leads: Lead[] = apiLeads || [];

  const totalLeads = leads.length;
  const newLeads = leads.filter((l: Lead) => l.status === "New").length;
  const qualifiedLeads = leads.filter((l: Lead) => l.status === "Qualified").length;
  const lostLeads = leads.filter((l: Lead) => l.status === "Lost").length;

  const stats = [
    { label: "Total Leads", value: totalLeads, icon: Users, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20 hover:border-primary/40" },
    { label: "New Inquiries", value: newLeads, icon: UserPlus, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20 hover:border-emerald-500/40" },
    { label: "Qualified", value: qualifiedLeads, icon: UserCheck, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20 hover:border-purple-500/40" },
    { label: "Lost Leads", value: lostLeads, icon: UserX, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20 hover:border-red-500/40" },
  ];

  return (
    <div className="flex flex-col h-full w-full min-w-0 overflow-hidden px-4 md:px-6 py-6 scrollbar-hide">
      <div className="flex flex-col gap-1 mb-10 shrink-0">
        <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
          Leads Management
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        </h1>
        <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Manage your property inquiry leads & conversions</p>
      </div>

      <div className="shrink-0 space-y-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary relative">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Conversion Pipeline</h3>
          <div className="h-px flex-1 bg-border/50" />
          <span className="text-muted-foreground"><Info className="h-4 w-4" /></span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s) => (
            <div 
              key={s.label} 
              className={cn(
                "group relative bg-card rounded-4xl border-2 transition-all duration-500 overflow-hidden hover:shadow-2xl hover:-translate-y-1 p-5",
                s.border
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2.5 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-md group-hover:scale-110", s.bg)}>
                  <s.icon className={cn("h-5 w-5", s.color)} />
                </div>
                <div className={cn("h-2.5 w-2.5 rounded-full bg-current", s.color)} />
              </div>
              <div>
                <div className="text-3xl font-black text-foreground tracking-tight">{s.value}</div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 space-y-6 overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 relative">
            <List className="h-5 w-5" />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Lead Database</h3>
          <div className="h-px flex-1 bg-border/50" />
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-h-[200px] overflow-auto">
          {leadsLoading ? (
            <div className="h-full w-full flex flex-col items-center justify-center gap-4 py-20">
              <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-bold text-muted-foreground animate-pulse uppercase tracking-widest">Fetching live leads from Bitrix24...</p>
            </div>
          ) : (
            <LeadsTable leads={leads} />
          )}
        </div>
      </div>
    </div>
  );
}
