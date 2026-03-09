"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ModernField } from "./modern-field";
import { Search } from "lucide-react";

interface ModernSearchSelectProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  options: string[] | { label: string; value: string }[];
  icon?: any;
  required?: boolean;
  error?: string;
  placeholder?: string;
}

const ModernSearchSelect = ({ 
  label, 
  value, 
  onChange, 
  options,
  icon, 
  required, 
  error,
  placeholder = "Search..."
}: ModernSearchSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  
  const formattedOptions = useMemo(() => {
    return options.map(opt => typeof opt === 'string' ? { label: opt, value: opt } : opt);
  }, [options]);

  const filteredOptions = useMemo(() => {
    return formattedOptions.filter(o => 
      o.label.toLowerCase().includes(search.toLowerCase()) || 
      o.value.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, formattedOptions]);

  const selectedOption = formattedOptions.find(o => o.value === value);

  return (
    <div className="relative w-full">
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        <ModernField 
          label={label} 
          icon={icon} 
          required={required} 
          isSelect 
          value={value}
          error={error}
          isFocused={open}
          onClear={value ? () => onChange("") : undefined}
          readOnly
        >
          <div className="text-sm font-semibold text-slate-700 h-full flex items-center pt-1">
            {selectedOption?.label || " "}
          </div>
        </ModernField>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-[52px] left-0 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input 
                autoFocus
                className="w-full h-9 bg-slate-50 border border-slate-100 rounded-lg pl-8 pr-3 text-xs focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="max-h-60 overflow-y-auto custom-scrollbar pr-1">
              {filteredOptions.length > 0 ? filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={cn(
                    "w-full text-left px-3 py-2 text-xs rounded-lg transition-all font-medium mb-0.5",
                    value === opt.value ? "text-primary font-bold bg-primary/5" : "text-slate-600 hover:bg-slate-50"
                  )}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  {opt.label}
                </button>
              )) : (
                <div className="p-8 text-center text-xs text-slate-400 font-medium italic">No results found</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export { ModernSearchSelect };
