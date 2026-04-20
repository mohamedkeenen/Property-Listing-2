"use client";

import { LeadsTable } from "@/components/leads/LeadsTable";
import { useGetLeadsQuery, useSyncLeadsMutation } from "@/api/redux/services/leadsApi";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { LeadsHeader } from "@/components/leads/LeadsHeader";
import { LeadsStats } from "@/components/leads/LeadsStats";
import { 
  List as LucideList, 
  Search as LucideSearch
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

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); 
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); 
  };

  return (
    <div className="flex flex-col h-full w-full min-w-0 overflow-hidden px-4 md:px-6 py-6 scrollbar-hide">
      <LeadsHeader totalCount={totalCount} />

      <LeadsStats stats={globalStats} />

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
