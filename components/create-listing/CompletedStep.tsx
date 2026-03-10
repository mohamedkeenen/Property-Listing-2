import { UseFormReturn } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Rocket, FileText, Lock, Users, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface Props {
  form: UseFormReturn<any>;
}

const publishOptions = [
  { value: "publish", label: "Publish Immediately", desc: "Push listing to all selected portals right now", icon: Rocket },
  { value: "draft", label: "Save as Draft", desc: "Keep it in your inventory for later editing", icon: FileText },
  { value: "approval", label: "Send for Approval", desc: "Notify admin to review compliance details", icon: Users },
  { value: "pocket", label: "Private Listing", desc: "Only visible to your internal network", icon: Lock },
];

export function CompletedStep({ form }: Props) {
  const { watch, setValue } = form;
  const router = useRouter();
  const { toast } = useToast();
  const publishStatus = watch("publishStatus") || "publish";

  const handleFinalSubmit = () => {
    // In a real app, this is where the API call happens
    toast({
      title: "Success! 🎉",
      description: "Your property has been listed and is currently syncing with portals.",
    });
    // Clear draft and redirect
    localStorage.removeItem("property-listing-draft");
    router.push("/");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-700 pb-20">
      <div className="text-center space-y-4">
        <div className="relative inline-flex">
           <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
           <div className="relative h-24 w-24 rounded-4xl bg-linear-to-tr from-primary to-indigo-600 flex items-center justify-center shadow-2xl shadow-primary/40">
              <CheckCircle2 className="h-12 w-12 text-white" />
           </div>
        </div>
        <div>
           <h2 className="text-3xl font-black text-foreground tracking-tight">Listing Completed!</h2>
           <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[10px] mt-2">All verification steps are successfully finished</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {publishOptions.map((opt) => {
          const isSelected = publishStatus === opt.value;
          return (
            <Card 
              key={opt.value}
              className={cn(
                "relative overflow-hidden cursor-pointer transition-all duration-500 border border-border/40",
                isSelected 
                  ? "bg-card shadow-2xl shadow-primary/10 border-primary/20 ring-1 ring-primary/10 scale-[1.02]" 
                  : "bg-muted/10 opacity-70 hover:opacity-100 hover:bg-muted/20"
              )}
              onClick={() => setValue("publishStatus", opt.value)}
            >
              <CardContent className="p-8">
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500",
                    isSelected ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-muted text-muted-foreground"
                  )}>
                    <opt.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className={cn(
                      "text-sm font-black tracking-tight transition-colors",
                      isSelected ? "text-foreground" : "text-muted-foreground"
                    )}>{opt.label}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{opt.desc}</p>
                  </div>
                </div>
              </CardContent>
              {isSelected && (
                <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary animate-pulse" />
              )}
            </Card>
          );
        })}
      </div>

      <div className="pt-8 flex flex-col items-center gap-6">
         <Button 
           onClick={handleFinalSubmit}
           className="h-16 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] px-16 shadow-2xl shadow-primary/40 hover:shadow-primary/60 hover:-translate-y-1 transition-all bg-primary gap-4"
         >
           Finalize & Publish Listing
           <ArrowRight className="h-4 w-4" />
         </Button>
         <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest text-center max-w-sm leading-loose">
           By clicking publish, your listing will be immediately broadcast to the selected distribution channels.
         </p>
      </div>
    </div>
  );
}
