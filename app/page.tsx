"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { ListingsFilters, FiltersState } from "@/components/dashboard/ListingsFilters";
import { ListingsTable } from "@/components/dashboard/ListingsTable";
import { PropertyDetailDialog } from "@/components/listings/PropertyDetailDialog";
import { mockListings, PropertyListing } from "@/data/mockData";

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
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Property listings overview & analytics</p>
      </div>

      <StatsCards />
      <DashboardCharts />
      <ListingsFilters onApply={setFilters} />
      <ListingsTable
        listings={filtered}
        onViewDetails={setSelectedListing}
        onEdit={(l) => router.push("/create-listing")}
      />

      <PropertyDetailDialog
        listing={selectedListing}
        open={!!selectedListing}
        onClose={() => setSelectedListing(null)}
      />
    </div>
  );
}
