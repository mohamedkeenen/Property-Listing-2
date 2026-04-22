"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { ListingsFilters, FiltersState } from "@/components/dashboard/ListingsFilters";
import { ListingsTable } from "@/components/dashboard/ListingsTable";
import { PropertyDetailDialog } from "@/components/listings/PropertyDetailDialog";
import { PropertyListing } from "@/data/mockData";
import { useGetPropertiesQuery, useSyncBitrixMutation } from "@/api/redux/services/propertyApi";
import { useGetAgentsQuery } from "@/api/redux/services/userApi";
import { mapBackendPropertyToFrontend } from "@/lib/mappers";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { RefreshCcw, BarChart3, Info, PieChart, List, Search, Loader2, Database } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [filters, setFilters] = useState<FiltersState | null>(null);
  const [selectedListing, setSelectedListing] = useState<PropertyListing | null>(null);

  const { data: propertiesData, isLoading, refetch } = useGetPropertiesQuery({ limit: 100 });
  const [syncBitrix, { isLoading: isSyncing }] = useSyncBitrixMutation();
  const { data: agentsData } = useGetAgentsQuery();

  const agentNames = useMemo(() => {
    return agentsData?.data?.map((a: any) => a.name) || [];
  }, [agentsData]);

  const listings = useMemo(() => {
    return propertiesData?.data?.map(mapBackendPropertyToFrontend) || [];
  }, [propertiesData]);

  const filtered = useMemo(() => {
    if (!filters) return listings;
    return listings.filter((l: PropertyListing) => {
      if (filters.refId && !l.reference.toLowerCase().includes(filters.refId.toLowerCase())) return false;
      if (filters.city && (l.property_location || l.location || l.bayutLocation) !== filters.city) return false;
      if (filters.community && (l.community || l.bayutCommunity) !== filters.community) return false;
      if (filters.propertyType && l.type !== filters.propertyType) return false;
      if (filters.category && l.category !== filters.category) return false;
      if (filters.purpose && l.purpose !== filters.purpose) return false;
      if (filters.agent && l.listingAgent !== filters.agent) return false;
      if (filters.status && l.status !== filters.status) return false;
      if (filters.bedroomsMin && l.bedrooms < Number(filters.bedroomsMin)) return false;
      if (filters.bedroomsMax && l.bedrooms > Number(filters.bedroomsMax)) return false;
      if (filters.priceMin && l.price < Number(filters.priceMin)) return false;
      if (filters.priceMax && l.price > Number(filters.priceMax)) return false;
      if (filters.portal) {
        if (filters.portal === "Property Finder" && !l.portals.pf) return false;
        if (filters.portal === "Bayut" && !l.portals.bayut) return false;
        if (filters.portal === "Dubizzle" && !l.portals.dubizzle) return false;
        if (filters.portal === "Website" && !l.portals.website) return false;
      }
      return true;
    });
  }, [filters, listings]);

  const handleRefresh = async () => {
    try {
      const res = await syncBitrix().unwrap();
      await refetch().unwrap();
      toast.success(`Inventory synchronized! ${res.count || 0} items updated from Bitrix.`);
    } catch (err: any) {
      console.error("[Sync Error]", err);
      const msg = err?.data?.message || err?.data?.error || "Failed to sync inventory.";
      toast.error(msg, { duration: 8000 });
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full min-w-0 overflow-y-auto overflow-x-hidden p-4 md:p-8 space-y-10 custom-scrollbar">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-2 shrink-0">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter flex items-center gap-4">
            Dashboard
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
          </h1>
          <p className="text-[10px] md:text-xs text-muted-foreground font-black uppercase tracking-[0.2em] opacity-70">Property listings overview & analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex-1 sm:flex-none rounded-2xl font-black text-[10px] uppercase tracking-widest h-12 px-6 gap-3 border-2 border-primary/30 bg-primary/5 text-primary hover:border-primary hover:bg-primary hover:text-white transition-all active:scale-95 shadow-sm hover:shadow-primary/20"
          >
              <RefreshCcw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              <span className="hidden xs:inline">Refresh</span>
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isSyncing}
            className="flex-1 sm:flex-none rounded-2xl font-black text-[10px] uppercase tracking-widest h-12 px-8 gap-3 border-2 border-primary/30 bg-primary/5 text-primary hover:border-primary hover:bg-primary hover:text-white transition-all active:scale-95 shadow-sm hover:shadow-primary/20"
          >
              <Database className={cn("h-4 w-4", isSyncing && "animate-spin")} />
              Sync <span className="hidden xs:inline">Bitrix</span>
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="shrink-0 space-y-8 mb-10">
        <div className="space-y-6 text-card-foreground">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary relative">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Market Overview</h3>
            <div className="h-px flex-1 bg-border/50" />
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>
          <StatsCards listings={listings} />
        </div>

        {/* Charts Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 relative">
              <PieChart className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Performance Analytics</h3>
            <div className="h-px flex-1 bg-border/50" />
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
          <DashboardCharts listings={listings} />
        </div>
      </div>

      {/* Table Section - This will take all remaining height */}
      <div className="flex-1 flex flex-col min-h-0 space-y-6 overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 relative">
            <List className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-foreground">Inventory Management</h3>
          <div className="h-px flex-1 bg-border/50" />
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 flex flex-col min-h-0 space-y-4">
          <ListingsFilters onApply={setFilters} agentOptions={agentNames} />
          <div className="flex-1 min-h-0 relative">
            {isLoading ? (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Syncing Inventory...</p>
                </div>
              </div>
            ) : (
              <ListingsTable
                listings={filtered}
                onViewDetails={setSelectedListing}
                onEdit={(l) => router.push(`/create-listing?id=${l.id}`)}
              />
            )}
          </div>
        </div>
      </div>

      <PropertyDetailDialog
        listing={selectedListing}
        open={!!selectedListing}
        onClose={() => setSelectedListing(null)}
      />
    </div>
  );
}
