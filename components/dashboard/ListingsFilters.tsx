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
            
            <div className="space-y-1.5">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Country</label>
               <Select value={filters.country} onValueChange={(v) => update("country", v)}>
                 <SelectTrigger className="h-10 text-xs font-bold rounded-xl bg-background border-border"><SelectValue placeholder="All Countries" /></SelectTrigger>
                 <SelectContent className="rounded-xl p-1">{filterOptions.countries.map((c) => <SelectItem key={c} value={c} className="rounded-lg">{c}</SelectItem>)}</SelectContent>
               </Select>
            </div>

            <div className="space-y-1.5">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">City</label>
               <Select value={filters.city} onValueChange={(v) => update("city", v)}>
                 <SelectTrigger className="h-10 text-xs font-bold rounded-xl bg-background border-border"><SelectValue placeholder="All Cities" /></SelectTrigger>
                 <SelectContent className="rounded-xl p-1">{filterOptions.cities.map((c) => <SelectItem key={c} value={c} className="rounded-lg">{c}</SelectItem>)}</SelectContent>
               </Select>
            </div>

            <div className="space-y-1.5">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Community</label>
               <Select value={filters.community} onValueChange={(v) => update("community", v)}>
                 <SelectTrigger className="h-10 text-xs font-bold rounded-xl bg-background border-border"><SelectValue placeholder="All Communities" /></SelectTrigger>
                 <SelectContent className="rounded-xl p-1">{filterOptions.communities.map((c) => <SelectItem key={c} value={c} className="rounded-lg">{c}</SelectItem>)}</SelectContent>
               </Select>
            </div>

            <div className="space-y-1.5">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Type</label>
               <Select value={filters.propertyType} onValueChange={(v) => update("propertyType", v)}>
                 <SelectTrigger className="h-10 text-xs font-bold rounded-xl bg-background border-border"><SelectValue placeholder="All Types" /></SelectTrigger>
                 <SelectContent className="rounded-xl p-1">{filterOptions.propertyTypes.map((c) => <SelectItem key={c} value={c} className="rounded-lg">{c}</SelectItem>)}</SelectContent>
               </Select>
            </div>

            <div className="space-y-1.5">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Category</label>
               <Select value={filters.category} onValueChange={(v) => update("category", v)}>
                 <SelectTrigger className="h-10 text-xs font-bold rounded-xl bg-background border-border"><SelectValue placeholder="Resident / Comm." /></SelectTrigger>
                 <SelectContent className="rounded-xl p-1">{filterOptions.categories.map((c) => <SelectItem key={c} value={c} className="rounded-lg">{c}</SelectItem>)}</SelectContent>
               </Select>
            </div>

            <div className="space-y-1.5">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Purpose</label>
               <Select value={filters.purpose} onValueChange={(v) => update("purpose", v)}>
                 <SelectTrigger className="h-10 text-xs font-bold rounded-xl bg-background border-border"><SelectValue placeholder="Sale / Rent" /></SelectTrigger>
                 <SelectContent className="rounded-xl p-1">{filterOptions.purposes.map((c) => <SelectItem key={c} value={c} className="rounded-lg">{c}</SelectItem>)}</SelectContent>
               </Select>
            </div>

            <div className="space-y-1.5">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Agent</label>
               <Select value={filters.agent} onValueChange={(v) => update("agent", v)}>
                 <SelectTrigger className="h-10 text-xs font-bold rounded-xl bg-background border-border"><SelectValue placeholder="Select Agent" /></SelectTrigger>
                 <SelectContent className="rounded-xl p-1">{filterOptions.agents.map((c) => <SelectItem key={c} value={c} className="rounded-lg">{c}</SelectItem>)}</SelectContent>
               </Select>
            </div>

            <div className="space-y-1.5">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Status</label>
               <Select value={filters.status} onValueChange={(v) => update("status", v)}>
                 <SelectTrigger className="h-10 text-xs font-bold rounded-xl bg-background border-border"><SelectValue placeholder="Any Status" /></SelectTrigger>
                 <SelectContent className="rounded-xl p-1">{filterOptions.statuses.map((c) => <SelectItem key={c} value={c} className="rounded-lg">{c}</SelectItem>)}</SelectContent>
               </Select>
            </div>

            <div className="space-y-1.5">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Portal</label>
               <Select value={filters.portal} onValueChange={(v) => update("portal", v)}>
                 <SelectTrigger className="h-10 text-xs font-bold rounded-xl bg-background border-border"><SelectValue placeholder="Select Portal" /></SelectTrigger>
                 <SelectContent className="rounded-xl p-1">{filterOptions.portals.map((c) => <SelectItem key={c} value={c} className="rounded-lg">{c}</SelectItem>)}</SelectContent>
               </Select>
            </div>

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
