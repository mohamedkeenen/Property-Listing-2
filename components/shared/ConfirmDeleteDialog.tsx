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
  confirmText?: string;
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Are you sure you want to delete?",
  description = "This action cannot be undone. This will permanently delete the record from our servers.",
  loading = false,
  itemName,
  confirmText
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-xl p-10 border-none shadow-2xl overflow-hidden bg-white/95 dark:bg-card/95 backdrop-blur-3xl">
        <div className="flex flex-col items-center text-center space-y-10 pt-4">
          <div className="space-y-6 w-full">
            <DialogTitle className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
              {title}
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-muted-foreground/60 font-medium leading-relaxed px-8 text-sm max-w-lg mx-auto">
              {description}
            </DialogDescription>
            
            {itemName && (
              <div className="w-full bg-slate-100/80 dark:bg-slate-900/60 p-4 rounded-lg border border-slate-200 dark:border-white/5 flex items-center justify-center gap-4 transition-all duration-500">
                <span className="text-sm font-black text-slate-700 dark:text-slate-300 tracking-wider">
                  {itemName}
                </span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-row gap-4 mt-10 sm:justify-center w-full">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-12 rounded-lg font-black text-[10px] uppercase tracking-[0.3em] text-slate-400 dark:text-muted-foreground/40 bg-transparent border-border shadow-sm cursor-pointer"
            disabled={loading}
          >
            Go Back
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="flex-1 h-12 rounded-lg bg-red-600 hover:bg-red-700 text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-lg shadow-red-500/20 active:scale-95 transition-all scroll-none"
            disabled={loading}
          >
            {loading ? "Deleting..." : (confirmText || "Delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
