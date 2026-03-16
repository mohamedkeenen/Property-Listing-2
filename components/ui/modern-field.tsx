"use client";

import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModernFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  error?: string;
  icon?: any;
  flag?: string | null;
  isSelect?: boolean;
  onClear?: () => void;
  children?: React.ReactNode;
  value?: any;
  isFocused?: boolean;
}

const ModernField = forwardRef<HTMLInputElement, ModernFieldProps>(
  ({ label, required, error, icon: Icon, flag, isSelect, onClear, children, value, isFocused: externalFocused, ...props }, ref) => {
    const [internalFocused, setInternalFocused] = useState(false);
    const [hasInternalValue, setHasInternalValue] = useState(false);
    
    const isFocused = externalFocused || internalFocused;
    const isFilled = (value !== undefined && value !== "" && value !== null) || (props.defaultValue !== undefined && props.defaultValue !== "" && props.defaultValue !== null) || isFocused || hasInternalValue;

    return (
      <div className="relative w-full group">
        <div 
          onFocusCapture={() => setInternalFocused(true)}
          onBlurCapture={() => setInternalFocused(false)}
          className={cn(
            "relative flex items-center min-h-14 h-auto w-full rounded-xl border transition-all duration-300 overflow-visible px-4 gap-3 bg-background py-3",
            isFocused ? "border-primary ring-4 ring-primary/5 shadow-sm" : "border-border hover:border-primary/20",
            error ? "border-destructive ring-destructive/10" : ""
          )}
        >
          {flag ? (
            <div className="shrink-0 transition-all duration-300 text-lg flex items-center justify-center w-6 h-6">
              {flag}
            </div>
          ) : Icon && (
            <div className={cn(
              "shrink-0 transition-all duration-300",
              isFocused ? "text-primary scale-110" : "text-muted-foreground"
            )}>
              <Icon className="h-5 w-5" strokeWidth={2.5} />
            </div>
          )}

          <div className="flex-1 h-full relative overflow-visible flex flex-col justify-center">
            {children ? (
              <div className="w-full h-full flex items-center min-h-6">
                {children}
              </div>
            ) : (
            <input
                {...props}
                ref={ref}
                placeholder={isFocused ? props.placeholder : ""}
                min={props.type === "number" ? (props.min ?? 0) : props.min}
                onInput={(e) => {
                  setHasInternalValue(!!e.currentTarget.value);
                  props.onInput?.(e);
                }}
                onFocus={(e) => {
                  setInternalFocused(true);
                  props.onFocus?.(e);
                }}
                onBlur={(e) => {
                  setInternalFocused(false);
                  setHasInternalValue(!!e.currentTarget.value);
                  props.onBlur?.(e);
                }}
                className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-foreground outline-none h-full placeholder:text-muted-foreground/50"
              />
            )}

            <label
              className={cn(
                "absolute pointer-events-none transition-all duration-300 px-1 font-bold select-none z-10 uppercase tracking-[0.15em] whitespace-nowrap",
                props.dir === "rtl" ? "right-0" : "left-0",
                isFilled 
                  ? "-top-[26px] text-[10px] text-primary bg-background py-0.5" 
                  : "top-[50%] -translate-y-1/2 text-[11px] text-muted-foreground"
              )}
            >
              {label}{required && <span className="text-destructive ml-1">*</span>}
            </label>
          </div>
          
          {onClear && (value !== undefined && value !== "" && value !== null) && (
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="shrink-0 text-muted-foreground hover:text-foreground transition-all p-1.5 rounded-full hover:bg-muted/50 z-20"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        {error && <p className="text-[10px] text-destructive mt-1.5 ml-1 font-bold uppercase tracking-wider animate-in fade-in slide-in-from-top-1">{error}</p>}
      </div>
    );
  }
);

ModernField.displayName = "ModernField";

export { ModernField };
