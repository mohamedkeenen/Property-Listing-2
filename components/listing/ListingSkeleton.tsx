import { Skeleton } from "@/components/ui/skeleton";

export function ListingSkeleton() {
  return (
    <div className="max-w-[1700px] mx-auto px-6 py-2 space-y-4 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 border-b border-border/10">
        <div className="flex items-center gap-6">
          <Skeleton className="h-14 w-14 rounded-2xl shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 md:w-[400px]" />
            <Skeleton className="h-4 w-48 opacity-60" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-40 rounded-3xl" />
          <Skeleton className="h-14 w-28 rounded-3xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-9 space-y-10">
          {/* Gallery Skeleton */}
          <Skeleton className="aspect-16/10 md:aspect-16/7.5 rounded-[2.5rem]" />
          
          {/* Info Cards Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-4xl" />
            ))}
          </div>

          {/* Descriptions Skeleton */}
          <div className="space-y-8">
            <Skeleton className="h-[200px] rounded-[2.5rem]" />
            <Skeleton className="h-[200px] rounded-[2.5rem]" />
          </div>

          {/* Virtual Tour Skeleton */}
          <Skeleton className="aspect-video rounded-[3rem]" />
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-3 space-y-10">
          <Skeleton className="h-[500px] rounded-[2.5rem]" />
          <Skeleton className="h-[400px] rounded-[2.5rem]" />
        </div>
      </div>
    </div>
  );
}
