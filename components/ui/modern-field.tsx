"use client";

import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface ModernFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  error?: string;
  icon?: any;
  isSelect?: boolean;
  onClear?: () => void;
  children?: React.ReactNode;
  value?: any;
  isFocused?: boolean;
}

const ModernField = forwardRef<HTMLInputElement, ModernFieldProps>(
  ({ label, required, error, icon: Icon, isSelect, onClear, children, value, isFocused: externalFocused, ...props }, ref) => {
    const [internalFocused, setInternalFocused] = useState(false);
    const isFocused = externalFocused || internalFocused;
    const isFilled = (value !== undefined && value !== "" && value !== null && value !== 0) || isFocused;

    return (
      <div className="relative w-full group">
        <div 
          className={cn(
            "relative flex items-center h-12 w-full rounded-xl border transition-all duration-200 overflow-visible px-4 gap-3 bg-white",
            isFocused ? "border-primary ring-2 ring-primary/5 shadow-sm" : "border-slate-200 hover:border-slate-300",
            error ? "border-destructive ring-destructive/10" : ""
          )}
        >
          {Icon && (
            <div className={cn(
              "shrink-0 transition-colors duration-200",
              isFocused ? "text-primary" : "text-slate-400"
            )}>
              <Icon className="h-4 w-4" strokeWidth={2} />
            </div>
          )}

          <div className="flex-1 h-full flex items-center relative overflow-visible">
            {children ? (
              <div className="w-full h-full flex items-center pt-2">
                 {children}
              </div>
            ) : (
              <input
                {...props}
                ref={ref}
                onFocus={(e) => {
                  setInternalFocused(true);
                  props.onFocus?.(e);
                }}
                onBlur={(e) => {
                  setInternalFocused(false);
                  props.onBlur?.(e);
                }}
                className="w-full bg-transparent border-none focus:ring-0 text-sm font-semibold text-slate-700 placeholder:text-slate-300 outline-none h-full pt-1"
              />
            )}

            <label
              className={cn(
                "absolute left-0 pointer-events-none transition-all duration-200 px-1 font-medium select-none z-10",
                isFilled 
                  ? "-top-[10px] text-[10px] text-slate-500 bg-white" 
                  : "top-1/2 -translate-y-1/2 text-sm text-slate-400"
              )}
            >
              {label}{required && <span className="text-destructive ml-0.5">*</span>}
            </label>
          </div>
          
          {isSelect && !onClear && (
            <div className="shrink-0 text-slate-300 group-hover:text-slate-400 transition-colors">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}

          {onClear && isFilled && !isFocused && (
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="shrink-0 text-slate-300 hover:text-slate-500 transition-colors p-1 rounded-full hover:bg-slate-100"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        {error && <p className="text-[10px] text-destructive mt-1 ml-1 font-medium">{error}</p>}
      </div>
    );
  }
);
ModernField.displayName = "ModernField";

export { ModernField };
