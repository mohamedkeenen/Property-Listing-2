import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCreate() {
  return (
    <div className="space-y-8 animate-pulse w-full max-w-5xl mx-auto py-8">
      {/* Cards Area */}
      <div className="space-y-4 mb-12">
        <div className="flex items-center gap-2 mb-6">
           <Skeleton className="h-6 w-6 rounded" />
           <Skeleton className="h-5 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>

      {/* Form Fields Area */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center gap-2 mb-6">
           <Skeleton className="h-6 w-6 rounded" />
           <Skeleton className="h-5 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
             <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
