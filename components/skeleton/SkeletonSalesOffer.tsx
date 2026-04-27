import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonSalesOffer() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <TableRow key={`skeleton-sales-${i}`} className="border-b-0 hover:bg-transparent cursor-default">
          <TableCell><Skeleton className="h-12 w-12 rounded-lg" /></TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-4 w-12" /></TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-40" />
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
          <TableCell>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-32" />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-10 w-28 rounded-xl" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
