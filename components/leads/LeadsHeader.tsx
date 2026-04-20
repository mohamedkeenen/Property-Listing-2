import { cn } from "@/lib/utils";

interface LeadsHeaderProps {
  totalCount: number;
}

export function LeadsHeader({ totalCount }: LeadsHeaderProps) {
  return (
    <div className="flex flex-col gap-1 mb-10 shrink-0">
      <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
        Leads Management
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
      </h1>
      <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
        Managing {totalCount.toLocaleString()} leads in your local system
      </p>
    </div>
  );
}
