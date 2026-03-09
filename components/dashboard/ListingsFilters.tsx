import { useState } from "react";
import { ChevronDown, ChevronUp, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { filterOptions } from "@/data/mockData";

interface FiltersState {
  refId: string;
  country: string;
  city: string;
  community: string;
  propertyType: string;
  category: string;
  purpose: string;
  agent: string;
  bedroomsMin: string;
  bedroomsMax: string;
  priceMin: string;
  priceMax: string;
  status: string;
  portal: string;
  search: string;
}

const defaultFilters: FiltersState = {
  refId: "", country: "", city: "", community: "", propertyType: "", category: "", purpose: "", agent: "", bedroomsMin: "", bedroomsMax: "", priceMin: "", priceMax: "", status: "", portal: "", search: "",
};

interface Props {
  onApply: (filters: FiltersState) => void;
}

export function ListingsFilters({ onApply }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);

  const update = (key: keyof FiltersState, value: string) => {
    setFilters((f) => ({ ...f, [key]: value }));
  };

  const reset = () => {
    setFilters(defaultFilters);
    onApply(defaultFilters);
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-primary" />
          <span>Filters</span>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {expanded && (
        <div className="p-4 pt-0 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            <Input placeholder="Ref ID" value={filters.refId} onChange={(e) => update("refId", e.target.value)} className="h-9 text-sm" />
            <Select value={filters.country} onValueChange={(v) => update("country", v)}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Country" /></SelectTrigger>
              <SelectContent>{filterOptions.countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={filters.city} onValueChange={(v) => update("city", v)}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="City" /></SelectTrigger>
              <SelectContent>{filterOptions.cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={filters.community} onValueChange={(v) => update("community", v)}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Community" /></SelectTrigger>
              <SelectContent>{filterOptions.communities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={filters.propertyType} onValueChange={(v) => update("propertyType", v)}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Property Type" /></SelectTrigger>
              <SelectContent>{filterOptions.propertyTypes.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={filters.category} onValueChange={(v) => update("category", v)}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>{filterOptions.categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={filters.purpose} onValueChange={(v) => update("purpose", v)}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Sale / Rent" /></SelectTrigger>
              <SelectContent>{filterOptions.purposes.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={filters.agent} onValueChange={(v) => update("agent", v)}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Listing Agent" /></SelectTrigger>
              <SelectContent>{filterOptions.agents.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={filters.status} onValueChange={(v) => update("status", v)}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>{filterOptions.statuses.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={filters.portal} onValueChange={(v) => update("portal", v)}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Portal" /></SelectTrigger>
              <SelectContent>{filterOptions.portals.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Input placeholder="Bedrooms Min" type="number" value={filters.bedroomsMin} onChange={(e) => update("bedroomsMin", e.target.value)} className="h-9 text-sm" />
            <Input placeholder="Bedrooms Max" type="number" value={filters.bedroomsMax} onChange={(e) => update("bedroomsMax", e.target.value)} className="h-9 text-sm" />
            <Input placeholder="Price Min" type="number" value={filters.priceMin} onChange={(e) => update("priceMin", e.target.value)} className="h-9 text-sm" />
            <Input placeholder="Price Max" type="number" value={filters.priceMax} onChange={(e) => update("priceMax", e.target.value)} className="h-9 text-sm" />
          </div>
          <div className="flex items-center gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={reset} className="gap-1">
              <RotateCcw className="h-3 w-3" /> Reset
            </Button>
            <Button size="sm" onClick={() => onApply(filters)}>
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export type { FiltersState };
