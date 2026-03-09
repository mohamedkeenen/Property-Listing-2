import { CheckCircle2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  currentStep: number;
  steps: string[];
}

export function StepIndicator({ currentStep, steps }: Props) {
  return (
    <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
      <div className="flex items-center justify-between min-w-max px-2">
        {steps.map((step, i) => {
          const isComplete = i < currentStep;
          const isCurrent = i === currentStep;
          
          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2 group cursor-default">
                <div
                  className={cn(
                    "h-10 w-10 md:h-12 md:w-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-500",
                    isComplete
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-100"
                      : isCurrent
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/10 shadow-xl shadow-primary/30 scale-110"
                      : "bg-white border-2 border-slate-100 text-slate-300"
                  )}
                >
                  {isComplete ? (
                    <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 animate-in zoom-in duration-300" />
                  ) : (
                    <span className={cn(isCurrent ? "text-white" : "text-slate-300")}>
                      {i + 1}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors duration-300",
                    isCurrent ? "text-primary" : "text-slate-400"
                  )}
                >
                  {step}
                </span>
              </div>
              
              {i < steps.length - 1 && (
                <div className="flex-1 mx-4 h-0.5 bg-slate-100 relative rounded-full overflow-hidden min-w-[30px]">
                  <div 
                    className={cn(
                      "absolute inset-0 bg-primary transition-all duration-700 ease-in-out",
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

