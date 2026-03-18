"use client";

import { LeadsTable } from "@/components/leads/LeadsTable";
import { cn } from "@/lib/utils";
import { useGetLeadsQuery, useSyncLeadsMutation } from "@/api/redux/services/leadsApi";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

import { 
  Users as LucideUsers, 
  UserPlus as LucideUserPlus, 
  UserCheck as LucideUserCheck, 
  UserX as LucideUserX, 
  Info as LucideInfo, 
  List as LucideList, 
  Search as LucideSearch, 
  RefreshCw as LucideRefreshCw 
} from "lucide-react";

export default function Leads() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [filters, setFilters] = useState({
    source: "All",
    subSource: "All",
    status: "All Statuses",
    search: "",
  });

  const { data, isLoading: leadsLoading, isFetching } = useGetLeadsQuery({ 
    page, 
    limit,
    ...filters 
  });
  
  const [syncLeads, { isLoading: isSyncing }] = useSyncLeadsMutation();

  const handleSync = async () => {
    try {
      const res = await syncLeads().unwrap();
      toast({
        title: "Sync Successful",
        description: `Imported ${res.count} leads from Bitrix24.`,
      });
    } catch (err) {
      toast({
        title: "Sync Failed",
        description: "Could not synchronize with Bitrix24. Check your network or API settings.",
        variant: "destructive",
      });
    }
  };

  const leads = data?.leads || [];
  const totalCount = data?.total || 0;
  const globalStats = data?.stats || { total: 0, new: 0, qualified: 0, lost: 0 };

  const statsCards = [
    { label: "Total Database", value: globalStats.total, icon: LucideUsers, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
    { label: "New Leads", value: globalStats.new, icon: LucideUserPlus, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Qualified", value: globalStats.qualified, icon: LucideUserCheck, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { label: "Lost Leads", value: globalStats.lost, icon: LucideUserX, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
  ];

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page on filter change
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page on limit change
  };

  return (
    <div className="flex flex-col h-full w-full min-w-0 overflow-hidden px-4 md:px-6 py-6 scrollbar-hide">
      <div className="flex flex-col gap-1 mb-10 shrink-0">
        <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
          Leads Management
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
        </h1>
        <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Managing {totalCount.toLocaleString()} leads in your local system</p>
      </div>

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
                "group relative bg-card rounded-4xl border-2 transition-all duration-500 overflow-hidden hover:shadow-2xl hover:-translate-y-1 p-6",
                s.border
              )}
            >
              <div className="flex items-center justify-between mb-5">
                <div className={cn("p-3 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg group-hover:scale-110", s.bg)}>
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

      <div className="flex-1 flex flex-col min-h-0 space-y-6 overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 relative ring-1 ring-orange-500/20">
            <LucideList className="h-5 w-5" />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/80">Real-time Lead Repository</h3>
          <div className="h-px flex-1 bg-border/40" />
          <LucideSearch className="h-4 w-4 text-muted-foreground/30" />
        </div>
        
        <div className="flex-1 min-h-[300px] overflow-auto">
          {leadsLoading ? (
            <div className="h-full w-full flex flex-col items-center justify-center gap-5 py-32">
              <div className="relative h-16 w-16">
                  <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <LucideRefreshCw className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" />
              </div>
              <p className="text-xs font-black text-muted-foreground/60 animate-pulse uppercase tracking-[0.3em]">Establishing secure connection to database...</p>
            </div>
          ) : (
            <LeadsTable 
              leads={leads} 
              onPageChange={setPage}
              onLimitChange={handleLimitChange}
              totalCount={totalCount}
              currentPage={page}
              limit={limit}
              filters={filters}
              onSearchChange={(v) => updateFilter('search', v)}
              onSourceChange={(v) => updateFilter('source', v)}
              onSubSourceChange={(v) => updateFilter('subSource', v)}
              onStatusChange={(v) => updateFilter('status', v)}
              onSync={handleSync}
              isSyncing={isSyncing || isFetching}
            />
          )}
        </div>
      </div>
    </div>
  );
}
