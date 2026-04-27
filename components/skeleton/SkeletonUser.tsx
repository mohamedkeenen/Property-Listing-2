import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonUser() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <TableRow key={`skeleton-user-${i}`} className="border-b-0 hover:bg-transparent cursor-default">
          <TableCell><Skeleton className="h-12 w-12 rounded-xl" /></TableCell>
          <TableCell><Skeleton className="h-4 w-6" /></TableCell>
          <TableCell>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </TableCell>
          <TableCell>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-12" />
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
          <TableCell>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded" />
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-6 w-6 rounded" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
