import { useState } from "react";
import { ChevronDown, ChevronUp, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const SearchSelect = ({ 
  label, 
  value, 
  onValueChange, 
  options, 
  placeholder 
}: { 
  label: string; 
  value: string; 
  onValueChange: (v: string) => void; 
  options: string[]; 
  placeholder: string;
}) => {
  const [search, setSearch] = useState("");
  const filteredOptions = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{label}</label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-10 text-xs font-bold rounded-xl bg-background border-border hover:border-primary/50 transition-all">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="rounded-xl p-2 max-h-[400px] border-border shadow-2xl">
          <div className="relative mb-2 px-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input 
              autoFocus
              className="w-full h-9 bg-muted/50 border border-border/50 rounded-lg pl-9 pr-3 text-xs focus:ring-1 focus:ring-primary/20 outline-none transition-all text-foreground font-medium"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-[280px] overflow-y-auto custom-scrollbar">
            <SelectItem value="All" className="text-xs font-bold text-primary rounded-lg mb-0.5">All {label}s</SelectItem>
            {filteredOptions.length > 0 ? filteredOptions.map((opt) => (
              <SelectItem key={opt} value={opt} className="rounded-lg mb-0.5 text-xs font-medium">
                {opt}
              </SelectItem>
            )) : (
              <div className="py-4 text-center text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-50">No matches</div>
            )}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
};

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
    <div className="bg-card border-2 border-border rounded-[2.5rem] overflow-hidden shadow-sm transition-all hover:shadow-xl">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 text-sm font-black uppercase tracking-widest text-foreground hover:bg-muted/30 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
            <Search className="h-4 w-4" />
          </div>
          <span>Advanced Search Filters</span>
        </div>
        <div className="flex items-center gap-3">
           <span className="text-[10px] text-muted-foreground font-bold">{expanded ? "Hide Options" : "Show Options"}</span>
           {expanded ? <ChevronUp className="h-4 w-4 text-primary" /> : <ChevronDown className="h-4 w-4 text-primary" />}
        </div>
      </button>

      {expanded && (
        <div className="p-6 pt-0 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <div className="space-y-1.5">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Ref ID</label>
               <input 
                  placeholder="EX: KEEN-123" 
                  value={filters.refId} 
                  onChange={(e) => update("refId", e.target.value)} 
                  className="w-full h-10 px-4 text-xs font-bold rounded-xl border border-border bg-background focus:ring-4 focus:ring-primary/5 transition-all outline-none" 
               />
            </div>
            
            <SearchSelect 
              label="Country" 
              value={filters.country} 
              onValueChange={(v) => update("country", v === "All" ? "" : v)} 
              options={filterOptions.countries} 
              placeholder="All Countries" 
            />

            <SearchSelect 
              label="City" 
              value={filters.city} 
              onValueChange={(v) => update("city", v === "All" ? "" : v)} 
              options={filterOptions.cities} 
              placeholder="All Cities" 
            />

            <SearchSelect 
              label="Community" 
              value={filters.community} 
              onValueChange={(v) => update("community", v === "All" ? "" : v)} 
              options={filterOptions.communities} 
              placeholder="All Communities" 
            />

            <SearchSelect 
              label="Type" 
              value={filters.propertyType} 
              onValueChange={(v) => update("propertyType", v === "All" ? "" : v)} 
              options={filterOptions.propertyTypes} 
              placeholder="All Types" 
            />

            <SearchSelect 
              label="Category" 
              value={filters.category} 
              onValueChange={(v) => update("category", v === "All" ? "" : v)} 
              options={filterOptions.categories} 
              placeholder="Resident / Comm." 
            />

            <SearchSelect 
              label="Purpose" 
              value={filters.purpose} 
              onValueChange={(v) => update("purpose", v === "All" ? "" : v)} 
              options={filterOptions.purposes} 
              placeholder="Sale / Rent" 
            />

            <SearchSelect 
              label="Agent" 
              value={filters.agent} 
              onValueChange={(v) => update("agent", v === "All" ? "" : v)} 
              options={filterOptions.agents} 
              placeholder="Select Agent" 
            />

            <SearchSelect 
              label="Status" 
              value={filters.status} 
              onValueChange={(v) => update("status", v === "All" ? "" : v)} 
              options={filterOptions.statuses} 
              placeholder="Any Status" 
            />

            <SearchSelect 
              label="Portal" 
              value={filters.portal} 
              onValueChange={(v) => update("portal", v === "All" ? "" : v)} 
              options={filterOptions.portals} 
              placeholder="Select Portal" 
            />

            <div className="space-y-1.5">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Price Min</label>
               <input placeholder="Min Price" type="number" value={filters.priceMin} onChange={(e) => update("priceMin", e.target.value)} className="w-full h-10 px-4 text-xs font-bold rounded-xl border border-border bg-background focus:ring-4 focus:ring-primary/5 transition-all outline-none" />
            </div>

            <div className="space-y-1.5">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Price Max</label>
               <input placeholder="Max Price" type="number" value={filters.priceMax} onChange={(e) => update("priceMax", e.target.value)} className="w-full h-10 px-4 text-xs font-bold rounded-xl border border-border bg-background focus:ring-4 focus:ring-primary/5 transition-all outline-none" />
            </div>
          </div>
          
          <div className="flex items-center gap-3 justify-end pt-2">
            <Button variant="outline" onClick={reset} className="rounded-xl h-10 px-6 font-black uppercase tracking-widest text-[10px] gap-2">
              <RotateCcw className="h-3.5 w-3.5" /> Reset All
            </Button>
            <Button onClick={() => onApply(filters)} className="rounded-xl h-10 px-8 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
              Search Inventory
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export type { FiltersState };
