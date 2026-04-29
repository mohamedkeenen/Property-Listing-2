"use client";

import { forwardRef, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModernFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  required?: boolean;
  error?: string;
  icon?: any;
  flag?: string | null;
  onClear?: () => void;
  children?: React.ReactNode;
  value?: any;
  isFocused?: boolean;
  alignTop?: boolean;
}

const ModernField = forwardRef<HTMLInputElement, ModernFieldProps>(
  ({ label, required, error, icon: Icon, flag, onClear, children, value, isFocused: externalFocused, alignTop, ...props }, ref) => {
    const [internalFocused, setInternalFocused] = useState(false);
    const [hasInternalValue, setHasInternalValue] = useState(false);
    const internalInputRef = useRef<HTMLInputElement>(null);
    
    const isFocused = externalFocused || internalFocused;
    const isDate = props.type === "date";
    const isRTL = props.dir === "rtl";
    const isFilled = (value !== undefined && value !== "" && value !== null) || (props.defaultValue !== undefined && props.defaultValue !== "" && props.defaultValue !== null) || isFocused || hasInternalValue;

    const handleContainerClick = () => {
      const input = (internalInputRef as any)?.current;
      if (input) {
        input.focus();
        if (isDate && 'showPicker' in input) {
          try {
            (input as any).showPicker();
          } catch (e) {}
        }
      }
    };

    return (
      <div className="relative w-full group" dir={props.dir}>
        <div 
          onClick={handleContainerClick}
          onFocusCapture={() => setInternalFocused(true)}
          onBlurCapture={() => setInternalFocused(false)}
          className={cn(
            "relative flex w-full rounded-xl border transition-all duration-300 overflow-visible px-4 gap-3 bg-background py-3 cursor-text",
            alignTop ? "items-start" : "items-center min-h-14 h-auto",
            isFocused ? "border-primary ring-4 ring-primary/5 shadow-sm" : "border-border hover:border-primary/20",
            error ? "border-destructive ring-destructive/10" : "",
            props.readOnly ? "opacity-70 cursor-default bg-muted/10 grayscale-[0.2]" : ""
          )}
        >
          {flag ? (
            <div className={cn(
              "shrink-0 transition-all duration-300 text-lg flex items-center justify-center w-6 h-6",
              alignTop && "mt-1"
            )}>
              {flag}
            </div>
          ) : Icon && (
            <div 
              onClick={(e) => {
                if (isDate) {
                  e.stopPropagation();
                  handleContainerClick();
                }
              }}
              className={cn(
                "shrink-0 transition-all duration-300",
                isFocused ? "text-primary scale-110" : "text-foreground/50",
                alignTop && "mt-1",
                isDate && "cursor-pointer hover:text-primary transition-colors"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={2.5} />
            </div>
          )}

          <div className={cn(
            "flex-1 h-full relative overflow-visible flex flex-col",
            alignTop ? "justify-start" : "justify-center"
          )}>
            {children ? (
              <div className={cn(
                "w-full h-full flex min-h-6",
                alignTop ? "items-start pt-1" : "items-center"
              )}>
                {children}
              </div>
            ) : (
            <input
                {...props as any}
                ref={ref || internalInputRef}
                value={value ?? ""}
                placeholder={isFocused || (isDate && isFilled) ? props.placeholder : ""}
                min={props.type === "number" ? (props.min ?? 0) : props.min}
                onInput={(e) => {
                  setHasInternalValue(!!e.currentTarget.value);
                  props.onInput?.(e as any);
                }}
                onFocus={(e) => {
                  setInternalFocused(true);
                  props.onFocus?.(e as any);
                }}
                onBlur={(e) => {
                  setInternalFocused(false);
                  setHasInternalValue(!!e.currentTarget.value);
                  props.onBlur?.(e as any);
                }}
                className={cn(
                  "w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-foreground outline-none h-full placeholder:text-muted-foreground/30",
                  isDate && !isFocused && !value && "text-transparent",
                  isRTL && "text-right"
                )}
              />
            )}

            <label
              className={cn(
                "absolute pointer-events-none transition-all duration-300 px-1 font-bold select-none z-10 uppercase tracking-[0.15em] whitespace-nowrap",
                isRTL ? "right-0" : "left-0",
                isFilled 
                  ? "-top-[26px] text-[10px] text-primary bg-background py-0.5" 
                  : alignTop 
                    ? "top-1 text-[11px] text-muted-foreground"
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
