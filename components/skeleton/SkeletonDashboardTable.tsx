import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonDashboardTable() {
  return (
    <>
      {[...Array(10)].map((_, i) => (
        <TableRow key={`skeleton-dash-${i}`} className="border-b-0">
          <TableCell className="sticky left-0 bg-card z-10 shadow-[1px_0_0_rgba(0,0,0,0.1)] dark:shadow-[1px_0_0_rgba(255,255,255,0.1)]">
            <Skeleton className="h-8 w-8 rounded-xl" />
          </TableCell>
          <TableCell>
            <div className="flex gap-1.5 flex-wrap">
              <Skeleton className="h-5 w-7 rounded" />
              <Skeleton className="h-5 w-7 rounded" />
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-14 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="space-y-2 py-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
          </TableCell>
          <TableCell>
            <div className="space-y-2 py-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </TableCell>
          <TableCell>
            <div className="space-y-2 py-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell>
            <div className="flex items-center gap-3 py-1">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-3 py-1">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}
