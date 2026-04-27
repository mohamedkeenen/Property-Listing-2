import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonLead() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <TableRow key={`skeleton-lead-${i}`} className="border-b-0 hover:bg-transparent cursor-default">
          <TableCell><Skeleton className="h-12 w-12 rounded-full" /></TableCell>
          <TableCell>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </TableCell>
          <TableCell>
             <div className="space-y-2">
               <Skeleton className="h-4 w-40" />
               <Skeleton className="h-3 w-20" />
             </div>
          </TableCell>
          <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
          <TableCell>
            <Skeleton className="h-10 w-24 rounded-xl" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
