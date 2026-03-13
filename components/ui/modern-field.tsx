"use client";

import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModernFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
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
    const isFilled = (value !== undefined && value !== "" && value !== null) || isFocused;

    return (
      <div className="relative w-full group">
        <div 
          onFocusCapture={() => setInternalFocused(true)}
          onBlurCapture={() => setInternalFocused(false)}
          className={cn(
            "relative flex items-start min-h-12 h-auto w-full rounded-xl border transition-all duration-300 overflow-visible px-4 gap-3 bg-background py-3",
            isFocused ? "border-primary ring-4 ring-primary/5 shadow-sm" : "border-border hover:border-primary/20",
            error ? "border-destructive ring-destructive/10" : ""
          )}
        >
          {Icon && (
            <div className={cn(
              "shrink-0 transition-all duration-300 mt-0.5",
              isFocused ? "text-primary scale-110" : "text-muted-foreground"
            )}>
              <Icon className="h-4 w-4" strokeWidth={2.5} />
            </div>
          )}

          <div className="flex-1 h-full relative overflow-visible flex flex-col justify-start">
            {children ? (
              <div className="w-full h-full flex items-start pt-1.5 min-h-6">
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
                className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-foreground outline-none h-full pt-1"
              />
            )}

            <label
              className={cn(
                "absolute pointer-events-none transition-all duration-300 px-1 font-bold select-none z-10 uppercase tracking-widest",
                props.dir === "rtl" ? "right-0" : "left-0",
                isFilled 
                  ? "-top-[22px] text-[9px] text-primary bg-background" 
                  : "top-[2px] text-[11px] text-muted-foreground"
              )}
            >
              {label}{required && <span className="text-destructive ml-0.5">*</span>}
            </label>
          </div>
          
          {onClear && (value !== undefined && value !== "" && value !== null) && (
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="shrink-0 text-muted-foreground hover:text-foreground transition-all p-1.5 rounded-full hover:bg-muted/50 z-20 mt-0.5"
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
