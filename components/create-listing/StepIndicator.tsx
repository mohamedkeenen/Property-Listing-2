import { CheckCircle2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  currentStep: number;
  steps: string[];
  onStepClick?: (stepIndex: number) => void;
}

export function StepIndicator({ currentStep, steps, onStepClick }: Props) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const isComplete = i < currentStep;
          const isCurrent = i === currentStep;
          
          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div 
                className={cn(
                  "flex flex-col items-center gap-3",
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
                <span
                  className={cn(
                    "text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-500 mt-1",
                    isCurrent ? "text-primary translate-y-0 opacity-100" : isComplete ? "text-foreground/60 dark:text-white/60 group-hover:text-foreground" : "text-muted-foreground/40 dark:text-white/10 group-hover:text-muted-foreground/60"
                  )}
                >
                  {step}
                </span>
              </div>
              
              {i < steps.length - 1 && (
                <div className="flex-1 mx-6 h-px bg-muted dark:bg-white/10 relative rounded-full overflow-hidden min-w-[40px]">
                  <div 
                    className={cn(
                      "absolute inset-0 bg-linear-to-r from-primary to-blue-400 transition-all duration-1000 ease-in-out",
                      isComplete ? "translate-x-0" : "-translate-x-full"
                    )} 
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

