"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ModernField } from "./modern-field";

interface NumberSearchSelectProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  icon?: any;
  required?: boolean;
  count?: number;
  showStudio?: boolean;
  error?: string;
}

const NumberSearchSelect = ({ 
  label, 
  value, 
  onChange, 
  icon, 
  required, 
  count = 20, 
  showStudio = false,
  error 
}: NumberSearchSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  
  const options = useMemo(() => {
    let opts = Array.from({ length: count }, (_, i) => (i + 1).toString());
    if (showStudio) opts = ["Studio", ...opts];
    return opts.filter(o => o.toLowerCase().includes(search.toLowerCase()));
  }, [search, count, showStudio]);

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
            {value || " "}
          </div>
        </ModernField>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-[52px] left-0 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="relative mb-2">
              <input 
                autoFocus
                className="w-full h-8 bg-slate-50 border border-slate-100 rounded-lg px-3 text-xs focus:ring-1 focus:ring-primary/20 outline-none transition-all dark:bg-slate-900/50 dark:border-slate-800"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="max-h-48 overflow-y-auto custom-scrollbar pr-1">
              {options.length > 0 ? options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={cn(
                    "w-full text-left px-3 py-1.5 text-xs rounded-lg transition-all font-medium",
                    value === opt ? "text-primary font-bold bg-primary/5" : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                  )}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  {opt}
                </button>
              )) : (
                <div className="p-4 text-center text-xs text-slate-400 font-medium italic">No results found</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export { NumberSearchSelect };
