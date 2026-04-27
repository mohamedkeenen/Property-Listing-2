import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CloudUpload, CloudOff } from "lucide-react";

interface ConfirmPortalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  portalKey: string;
  isActivating: boolean;
  loading?: boolean;
  logoUrl?: string;
}

export function ConfirmPortalDialog({
  open,
  onOpenChange,
  onConfirm,
  portalKey,
  isActivating,
  loading = false,
  logoUrl,
}: ConfirmPortalDialogProps) {
  
  const portalConfigs: Record<string, { name: string; color: string; bg: string; border: string; btn: string; btnHover: string; shadow: string; icon: string }> = {
    pf: {
      name: "PROPERTY FINDER",
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-400",
      btn: "bg-red-500",
      btnHover: "hover:bg-red-600",
      shadow: "shadow-red-500/20",
      icon: "https://res.cloudinary.com/devht0mp5/image/upload/v1772105511/PF_ljkahc.png"
    },
    bayut: {
      name: "BAYUT",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-400",
      btn: "bg-emerald-500",
      btnHover: "hover:bg-emerald-600",
      shadow: "shadow-emerald-500/20",
      icon: "https://res.cloudinary.com/devht0mp5/image/upload/v1772105511/bayut_gy4ev2.png"
    },
    website: {
      name: "WEBSITE",
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
      border: "border-cyan-400",
      btn: "bg-cyan-500",
      btnHover: "hover:bg-cyan-600",
      shadow: "shadow-cyan-500/20",
      icon: "https://res.cloudinary.com/devht0mp5/image/upload/v1772529258/web_xgqvbi.png"
    },
    dubizzle: {
      name: "DUBIZZLE",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-400",
      btn: "bg-emerald-500",
      btnHover: "hover:bg-emerald-600",
      shadow: "shadow-emerald-500/20",
      icon: "https://res.cloudinary.com/devht0mp5/image/upload/v1775823210/download_gzle7f.png"
    }
  };

  const config = portalConfigs[portalKey] || portalConfigs.website;
  const dialogIcon = logoUrl || config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-4xl p-0 border border-border/50 shadow-2xl overflow-hidden bg-card/95 backdrop-blur-3xl text-card-foreground">
        <div className="relative h-40 w-full flex items-center justify-center">
            <div className={cn(
                "h-24 w-28 flex items-center justify-center transition-transform duration-500 animate-in zoom-in-50"
            )}>
                {dialogIcon ? (
                    <img src={dialogIcon} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                    isActivating ? <CloudUpload className={cn("h-10 w-10", config.color)} /> : <CloudOff className={cn("h-10 w-10", config.color)} />
                )}
            </div>
        </div>

        <div className="p-8 space-y-6 text-center">
            <div className="space-y-2">
                <DialogTitle className="text-2xl font-black tracking-tight text-foreground uppercase">
                    {isActivating ? "Publish Listing?" : "Remove Listing?"}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground font-medium text-xs leading-relaxed max-w-[280px] mx-auto">
                    {isActivating 
                        ? `Are you sure you want to push this property to ${config.name}? This will make the listing live for users.` 
                        : `Are you sure you want to remove this property from ${config.name}? Users will no longer see it there.`}
                </DialogDescription>
            </div>

            <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 flex items-center justify-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">PORTAL:</span>
                <span className={cn(
                    "text-[10px] font-black px-4 py-1.5 rounded-full border shadow-sm uppercase tracking-wider",
                    config.btn, "text-white", config.border
                )}>
                    {config.name}
                </span>
            </div>
        </div>

        <DialogFooter className="p-8 pt-0 grid grid-cols-2 gap-3 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-12 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground border-border/60 hover:bg-muted transition-all active:scale-95"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className={cn(
                "h-12 rounded-xl text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-lg active:scale-95 transition-all border-none",
                isActivating ? "bg-emerald-500 shadow-emerald-500/20" : "bg-red-500 shadow-red-500/20",
                isActivating ? "hover:bg-emerald-600" : "hover:bg-red-600"
            )}
            disabled={loading}
          >
            {loading ? "Syncing..." : (isActivating ? "Activate Now" : "Confirm Removal")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
