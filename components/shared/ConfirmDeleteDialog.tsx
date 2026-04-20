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
      <DialogContent className="max-w-3xl rounded-[2.5rem] p-12 border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.4)] md:shadow-[0_48px_96px_-24px_rgba(0,0,0,0.6)] overflow-hidden bg-white/95 dark:bg-card/95 backdrop-blur-3xl">
        <div className="flex flex-col items-center text-center space-y-10 pt-4">
          <div className="space-y-6 w-full">
            <DialogTitle className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase whitespace-nowrap">
              {title}
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-muted-foreground/60 font-medium leading-relaxed px-12 text-sm max-w-lg mx-auto">
              {description}
            </DialogDescription>
            
            {itemName && (
              <div className="w-full bg-slate-100/80 dark:bg-slate-900/60 p-6 rounded-4xl border border-slate-200 dark:border-white/5 flex items-center justify-center gap-4 transition-all duration-500">
                <span className="text-base font-black text-slate-700 dark:text-slate-300 tracking-wider">
                  {itemName}
                </span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-row gap-6 mt-12 sm:justify-center w-full">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-16 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] text-slate-400 dark:text-muted-foreground/40 bg-transparent border-2 border-slate-200 dark:border-border/20 shadow-md shadow-black/5 cursor-pointer"
            disabled={loading}
          >
            Go Back
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="flex-1 h-16 rounded-2xl bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-1 active:scale-95 transition-all duration-500 border-none"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Permanently"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
