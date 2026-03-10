"use client";

import { cn } from "@/lib/utils";
import { ModernField } from "./modern-field";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";

interface ModernSelectProps {
  label: string;
  value?: string;
  onValueChange: (value: string) => void;
  options: string[] | { label: string; value: string }[];
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
  const formattedOptions = options.map(opt => 
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

  return (
    <ModernField 
      label={label} 
      icon={icon} 
      required={required} 
      error={error}
      value={value}
      onClear={value ? () => onValueChange("") : undefined}
      // We don't use isSelect here because we'll let the standard SelectTrigger show its arrow,
      // but styled to match our design, or we hide it.
    >
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="border-none p-0 h-full w-full shadow-none focus:ring-0 text-sm font-bold text-foreground bg-transparent flex items-center justify-between group/trigger">
          <SelectValue placeholder=" " />
          {/* We hide the default SelectTrigger icon and let ModernField handle it if we want, 
              but it's better to just have one arrow. */}
          <ChevronDown className="h-3 w-3 text-muted-foreground/50 group-hover/trigger:text-primary transition-colors ml-2 shrink-0" />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-border shadow-xl">
          {formattedOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-xs font-medium">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </ModernField>
  );
}
