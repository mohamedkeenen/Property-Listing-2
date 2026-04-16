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
      if (filters.city && l.location !== filters.city) return false;
      if (filters.community && l.community !== filters.community) return false;
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
    <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden px-4 md:px-6 py-6">
      <div className="flex items-center justify-between mb-10">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
            Dashboard
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          </h1>
          <p className="text-xs text-muted-foreground font-medium">Property listings overview & analytics</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            disabled={isLoading}
            className="rounded-xl font-bold text-[10px] uppercase tracking-wider py-5 px-6 gap-2"
          >
            <RefreshCcw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
            Refresh List
          </Button>

          <Button 
            variant="default" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isSyncing}
            className="rounded-xl font-bold text-[10px] uppercase tracking-wider py-5 px-6 gap-2 bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95"
          >
            <Database className={cn("h-3.5 w-3.5", isSyncing && "animate-spin")} />
            Sync Bitrix
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
          <div className="flex-1 min-h-0 overflow-auto relative">
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
