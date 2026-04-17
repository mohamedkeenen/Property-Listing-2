import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Trash2 } from "lucide-react";
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
      <DialogContent className="max-w-md rounded-4xl p-8 border-none shadow-2xl overflow-hidden bg-card/95 backdrop-blur-xl">
        {/* Upper Gradient Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-red-500/50 to-transparent" />
        
        <div className="flex flex-col items-center text-center space-y-6 pt-2">
          {/* Icon Container */}
          <div className="h-20 w-20 rounded-3xl bg-red-500/10 flex items-center justify-center relative group">
            <div className="absolute inset-0 rounded-3xl bg-red-500/20 blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
            <div className="h-14 w-14 rounded-2xl bg-linear-to-tr from-red-600 to-red-400 flex items-center justify-center shadow-lg shadow-red-500/30 relative">
              <Trash2 className="h-7 w-7 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-card border-2 border-background flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
          </div>

          <div className="space-y-3">
            <DialogTitle className="text-2xl font-black tracking-tight text-foreground">
              {title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium leading-relaxed px-4">
              {description}
              {itemName && (
                <span className="block mt-2 text-foreground font-bold text-sm bg-muted/50 p-2 rounded-xl border border-border/40">
                  {itemName}
                </span>
              )}
            </DialogDescription>
          </div>
        </div>

        <DialogFooter className="flex flex-row gap-3 mt-8 sm:justify-center">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-12 rounded-2xl font-bold text-muted-foreground hover:bg-muted/80 transition-all border border-border/20"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="flex-1 h-12 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black shadow-lg shadow-red-600/20 active:scale-95 transition-all"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Permanently"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
