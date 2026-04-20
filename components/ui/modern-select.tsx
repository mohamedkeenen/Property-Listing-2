"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ModernField } from "./modern-field";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface ModernSelectProps {
  label: string;
  value?: string;
  onValueChange: (value: string) => void;
  options: string[] | { label: string; value: string; badge?: string; badgeColor?: string }[];
  icon?: any;
  required?: boolean;
  error?: string;
}

export function ModernSelect({ 
  label, 
  value, 
  onValueChange, 
  options, 
  icon, 
  required, 
  error 
}: ModernSelectProps) {
  const [search, setSearch] = useState("");

  const formattedOptions = useMemo(() => {
    const all = options.map(opt => typeof opt === 'string' ? { label: opt, value: opt } : opt);
    // Remove duplicates to prevent duplicate key errors
    const seen = new Set();
    return all.filter(opt => {
      if (seen.has(opt.value)) return false;
      seen.add(opt.value);
      return true;
    });
  }, [options]);

  const filteredOptions = useMemo(() => {
    if (!search) return formattedOptions;
    return formattedOptions.filter(o => 
      o.label.toLowerCase().includes(search.toLowerCase()) || 
      o.value.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, formattedOptions]);

  return (
    <ModernField 
      label={label} 
      icon={icon} 
      required={required} 
      error={error}
      value={value}
      onClear={value ? () => {
        onValueChange("");
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement && activeElement.tagName === 'BUTTON') {
          activeElement.blur();
        }
      } : undefined}
    >
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger 
          className="border-none p-0 h-full w-full shadow-none focus:ring-0 text-sm font-bold text-foreground bg-transparent flex items-center justify-between group/trigger [&_svg]:ml-2 [&_svg]:shrink-0 [&_svg]:text-muted-foreground/50 [&_svg]:group-hover/trigger:text-primary [&_svg]:transition-colors">
          <SelectValue placeholder=" " />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-border shadow-xl p-2 max-h-[400px]">
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
            {filteredOptions.length > 0 ? filteredOptions.map((opt) => (
              <SelectItem 
                key={opt.value} 
                value={opt.value} 
                className="text-xs font-medium rounded-lg mb-0.5 hover:bg-primary/5 focus:bg-primary/10 transition-colors"
              >
                <div className="flex items-center justify-between w-full gap-4">
                  <span>{opt.label}</span>
                  {opt.badge && (
                    <span className={cn(
                      "text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-md",
                      opt.badgeColor || "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                    )}>
                      {opt.badge}
                    </span>
                  )}
                </div>
              </SelectItem>
            )) : (
              <div className="py-8 text-center text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-50">No results found</div>
            )}
          </div>
        </SelectContent>
      </Select>
    </ModernField>
  );
}
