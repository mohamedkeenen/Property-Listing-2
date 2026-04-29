"use client";

import { useState, useEffect } from "react";
import { useSearchPFLocationsQuery } from "@/api/redux/services/propertyApi";
import { ModernField } from "@/components/ui/modern-field";
import { cn } from "@/lib/utils";
import { MapPin, Search, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { Badge } from "@/components/ui/badge";

interface PFLocationSelectProps {
  label: string;
  value?: string | number;
  onValueChange: (location: any) => void;
  icon?: any;
  required?: boolean;
  error?: string;
  placeholder?: string;
  initialLabel?: string;
}

export function PFLocationSelect({
  label,
  value,
  onValueChange,
  icon = MapPin,
  required,
  error,
  placeholder = "Search Property Finder Location...",
  initialLabel = ""
}: PFLocationSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLabel, setSelectedLabel] = useState(initialLabel);
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Sync with initialLabel if it changes
  useEffect(() => {
    if (initialLabel && !selectedLabel) {
      setSelectedLabel(initialLabel);
    }
  }, [initialLabel]);

  const { data: locations, isFetching, error: queryError } = useSearchPFLocationsQuery(debouncedSearch, {
    skip: debouncedSearch.length < 2,
  });

  // Try to keep track of the label if we only have the ID
  useEffect(() => {
    if (value && !selectedLabel) {
      const found = locations?.find((l: any) => l.id === value);
      if (found) {
        setSelectedLabel(found.name);
      }
    }
  }, [value, locations, selectedLabel]);

  const handleClear = () => {
    onValueChange({ id: 0, name: "", path: "", coordinates: null });
    setSelectedLabel("");
    setSearchTerm("");
  };

  return (
    <div className="relative w-full group">
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        <ModernField
          label={label}
          icon={icon}
          required={required}
          value={value}
          error={error}
          isFocused={open}
          onClear={value ? handleClear : undefined}
          readOnly
        >
          <div className="w-full h-full flex items-center pt-1 overflow-hidden">
            {value ? (
              <div className="flex flex-col truncate">
                <span className="text-sm font-bold text-foreground truncate">
                  {selectedLabel || `Location ID: ${value}`}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  {locations?.find((l: any) => l.id === value)?.type || "PF Location"}
                </span>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground/50 font-medium">
                {placeholder}
              </span>
            )}
          </div>
        </ModernField>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-background border border-border/60 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-50 p-4 overflow-hidden animate-in fade-in zoom-in-95 duration-300 backdrop-blur-xl bg-background/95">
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-primary/40" />
              </div>
              <input
                autoFocus
                className="w-full h-12 bg-muted/30 border border-border/40 rounded-2xl pl-11 pr-11 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all text-foreground font-semibold placeholder:text-muted-foreground/30"
                placeholder="Search locations (e.g. Dubai Marina...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {isFetching && (
                <div className="absolute inset-y-0 right-4 flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin text-primary/40" />
                </div>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto custom-scrollbar pr-1 -mr-2">
              {locations && locations.length > 0 ? (
                <div className="space-y-1.5 py-1">
                  {locations.map((loc: any) => (
                    <button
                      key={loc.id}
                      type="button"
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-2xl transition-all duration-300 relative group overflow-hidden border",
                        value === loc.id 
                          ? "bg-red-500 border-red-500/20 shadow-lg shadow-red-500/20" 
                          : "bg-transparent border-transparent hover:bg-red-500/5 hover:border-red-500/10"
                      )}
                      onClick={() => {
                        onValueChange(loc);
                        setSelectedLabel(loc.name);
                        setOpen(false);
                        setSearchTerm("");
                      }}
                    >
                      <div className="flex items-center justify-between gap-3 relative z-10">
                        <div className="flex flex-col truncate">
                          <span className={cn(
                            "text-sm transition-colors",
                            value === loc.id ? "text-white font-black" : "text-foreground font-bold"
                          )}>{loc.name}</span>
                          <div className="flex items-center gap-2 mt-1">
                             <Badge className={cn(
                               "text-[9px] px-1.5 py-0 uppercase font-black tracking-tighter border-none h-4",
                               value === loc.id ? "bg-white/20 text-white" : "bg-red-500/10 text-red-500"
                             )}>
                               {loc.type || 'Location'}
                             </Badge>
                             {loc.path && (
                               <span className={cn(
                                 "text-[10px] uppercase font-bold tracking-tight opacity-50 truncate max-w-[200px]",
                                 value === loc.id ? "text-white/80" : "text-muted-foreground"
                               )}>
                                 {loc.path}
                               </span>
                             )}
                          </div>
                        </div>
                        {value === loc.id && (
                          <div className="bg-white/20 rounded-full p-1 shrink-0">
                             <Search className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center space-y-5 animate-in fade-in duration-500">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-4xl bg-red-500/5 text-red-500/20 rotate-12 transition-transform hover:rotate-0">
                    <MapPin className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 leading-relaxed">
                      {queryError ? (
                        <span className="text-destructive">Sync Error</span>
                      ) : debouncedSearch.length < 2 ? (
                        "Awaiting Query"
                      ) : isFetching ? (
                        "Scanning Atlas"
                      ) : (
                        "No Matches Found"
                      )}
                    </h4>
                    <p className="text-[11px] text-muted-foreground/40 font-bold px-12 leading-relaxed max-w-[300px] mx-auto">
                      {queryError ? (
                        "The Property Finder Atlas API is currently unreachable."
                      ) : debouncedSearch.length < 2 ? (
                        "Type at least 2 characters to explore the Atlas database."
                      ) : isFetching ? (
                        "We're querying Property Finder's Atlas database."
                      ) : (
                        "We couldn't find any matches in Atlas. Try another name."
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
