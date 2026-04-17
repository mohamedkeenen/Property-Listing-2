import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  loading?: boolean;
  itemName?: string;
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Are you sure you want to delete?",
  description = "This action cannot be undone. This will permanently delete the record from our servers.",
  loading = false,
  itemName
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-4xl p-10 border-none shadow-2xl overflow-hidden bg-card/95 backdrop-blur-xl">
        {/* Upper Gradient Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-red-500/50 to-transparent" />
        
        <div className="flex flex-col items-center text-center space-y-6 pt-4">
          <div className="space-y-4">
            <DialogTitle className="text-3xl font-black tracking-tight text-foreground">
              {title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium leading-relaxed px-2 text-base">
              {description}
              {itemName && (
                <span className="block mt-4 text-foreground font-bold text-sm bg-muted/50 p-3 rounded-2xl border border-border/40">
                  {itemName}
                </span>
              )}
            </DialogDescription>
          </div>
        </div>

        <DialogFooter className="flex flex-row gap-4 mt-10 sm:justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-14 rounded-2xl font-black text-xs uppercase tracking-widest text-muted-foreground hover:bg-muted/80 transition-all border-2 border-border/40 active:scale-95"
            disabled={loading}
          >
            Go Back
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="flex-1 h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-red-600/30 active:scale-95 transition-all"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Permanently"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
