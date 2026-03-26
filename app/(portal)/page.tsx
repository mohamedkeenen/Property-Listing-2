"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { ListingsFilters, FiltersState } from "@/components/dashboard/ListingsFilters";
import { ListingsTable } from "@/components/dashboard/ListingsTable";
import { PropertyDetailDialog } from "@/components/listings/PropertyDetailDialog";
import { mockListings, PropertyListing } from "@/data/mockData";
import { BarChart3, List, PieChart, Search, Info, Loader2 } from "lucide-react";
import { useGetPropertiesQuery } from "@/api/redux/services/propertyApi";
import { mapBackendPropertyToFrontend } from "@/lib/mappers";

export default function Dashboard() {
  const router = useRouter();
  const [filters, setFilters] = useState<FiltersState | null>(null);
  const [selectedListing, setSelectedListing] = useState<PropertyListing | null>(null);

  const { data: propertiesData, isLoading } = useGetPropertiesQuery({});

  const listings = useMemo(() => {
    return propertiesData?.data?.data?.map(mapBackendPropertyToFrontend) || [];
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

  return (
    <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden px-4 md:px-6 py-6">
      <div className="flex flex-col gap-1 mb-10">
        <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
          Dashboard
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        </h1>
        <p className="text-xs text-muted-foreground font-medium">Property listings overview & analytics</p>
      </div>

      {/* Scrollable upper sections if needed, though you wanted it fixed */}
      <div className="shrink-0 space-y-8 mb-10">
        {/* Stats Section */}
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
          <ListingsFilters onApply={setFilters} />
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
