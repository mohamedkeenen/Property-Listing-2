import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  currentStep: number;
  steps: string[];
  onStepClick?: (stepIndex: number) => void;
}

export function StepIndicator({ currentStep, steps, onStepClick }: Props) {
  return (
    <div className="w-full">
      <div className="flex items-start justify-between w-full relative px-4 md:px-16">
        {steps.map((step, i) => {
          const isComplete = i < currentStep;
          const isCurrent = i === currentStep;
          
          return (
            <React.Fragment key={step}>
              {/* Step Marker Container */}
              <div 
                className={cn(
                  "flex flex-col items-center shrink-0 w-10 md:w-12 relative z-10",
                  onStepClick && "cursor-pointer group"
                )}
                onClick={() => onStepClick?.(i)}
              >
                <div
                  className={cn(
                    "h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center text-sm font-black transition-all duration-700 relative overflow-hidden",
                    isComplete
                      ? "bg-primary text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] group-hover:scale-110"
                      : isCurrent
                      ? "bg-primary text-white shadow-[0_0_30px_rgba(37,99,235,0.5)] ring-1 ring-white/20 scale-105"
                      : "bg-muted dark:bg-white/5 border border-border dark:border-white/10 text-muted-foreground/40 dark:text-white/20 group-hover:bg-muted/80"
                  )}
                >
                  {isComplete ? (
                    <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6" />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                  {isCurrent && (
                    <div className="absolute inset-0 bg-linear-to-tr from-white/20 to-transparent pointer-events-none" />
                  )}
                </div>
                
                {/* Responsive Label Container */}
                <div className="mt-4 absolute top-10 md:top-12 left-1/2 -translate-x-1/2 w-max">
                  <span
                    className={cn(
                      "text-[8px] md:text-[10px] font-black uppercase tracking-[0.12em] transition-all duration-500 whitespace-nowrap text-center block",
                      isCurrent ? "text-primary translate-y-0 opacity-100" : isComplete ? "text-foreground/60 dark:text-white/60 group-hover:text-foreground" : "text-muted-foreground/40 dark:text-white/10 group-hover:text-muted-foreground/60",
                      !isCurrent && "hidden md:block"
                    )}
                  >
                    {step}
                  </span>
                </div>
              </div>
              
              {/* Connector Line Connector */}
              {i < steps.length - 1 && (
                <div className="flex-1 mt-5 md:mt-6 h-[2px] bg-muted dark:bg-white/10 relative overflow-hidden z-0">
                  <div 
                    className={cn(
                      "absolute inset-0 bg-linear-to-r from-primary to-blue-400 transition-all duration-1000 ease-in-out",
                      isComplete ? "translate-x-0" : "-translate-x-full"
                    )} 
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

