"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { ListingsFilters, FiltersState } from "@/components/dashboard/ListingsFilters";
import { ListingsTable } from "@/components/dashboard/ListingsTable";
import { PropertyDetailDialog } from "@/components/listings/PropertyDetailDialog";
import { mockListings, PropertyListing } from "@/data/mockData";
import { BarChart3, List, PieChart, Search, Info } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [filters, setFilters] = useState<FiltersState | null>(null);
  const [selectedListing, setSelectedListing] = useState<PropertyListing | null>(null);

  const filtered = useMemo(() => {
    if (!filters) return mockListings;
    return mockListings.filter((l) => {
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
        if (filters.portal === "Website" && !l.portals.website) return false;
      }
      return true;
    });
  }, [filters]);

  return (
    <div className="p-4 md:p-8 space-y-10 w-full min-w-0">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
          Dashboard
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        </h1>
        <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Property listings overview & analytics</p>
      </div>

      {/* Stats Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary relative">
            <BarChart3 className="h-5 w-5" />
          </div>
          <h3 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em]">Market Overview</h3>
          <div className="h-px flex-1 bg-border/50" />
          <Info className="h-4 w-4 text-muted-foreground" />
        </div>
        <StatsCards />
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 relative">
            <PieChart className="h-5 w-5" />
          </div>
          <h3 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em]">Performance Analytics</h3>
          <div className="h-px flex-1 bg-border/50" />
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </div>
        <DashboardCharts />
      </div>

      {/* Table Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 relative">
            <List className="h-5 w-5" />
          </div>
          <h3 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em]">Inventory Management</h3>
          <div className="h-px flex-1 bg-border/50" />
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="space-y-4 min-w-0">
          <ListingsFilters onApply={setFilters} />
          <ListingsTable
            listings={filtered}
            onViewDetails={setSelectedListing}
            onEdit={(l) => router.push("/create-listing")}
          />
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
