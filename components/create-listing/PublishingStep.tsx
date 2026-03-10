import { Info } from "lucide-react";
import { PortalSelectionStep } from "./PortalSelectionStep";
import { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<any>;
}

export function PublishingStep({ form }: Props) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] mx-auto px-4 md:px-8">
      <div className="bg-background/50 backdrop-blur-md rounded-[2.5rem] p-10 border border-border/40 shadow-2xl">
         <PortalSelectionStep />
      </div>

      <div className="p-6 rounded-3xl bg-muted/30 border border-border/50 flex items-center gap-4 max-w-5xl mx-auto">
         <div className="h-10 w-10 rounded-2xl bg-background flex items-center justify-center shrink-0 shadow-sm border border-border">
            <Info className="h-5 w-5 text-primary" />
         </div>
         <p className="text-[11px] font-medium text-muted-foreground">
           Properties are usually synced within <span className="text-foreground font-bold">15-30 minutes</span> across all selected platforms after final publication.
         </p>
      </div>
    </div>
  );
}
