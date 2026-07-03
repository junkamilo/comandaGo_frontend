import { Skeleton } from "@/components/ui/skeleton";

export function PosSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1">
        <div className="hidden w-48 shrink-0 space-y-2 border-r border-border/60 p-3 md:block">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
        <div className="min-w-0 flex-1 space-y-3 p-4">
          <Skeleton className="h-10 w-full max-w-sm rounded-lg" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="hidden w-72 shrink-0 space-y-3 border-l border-border/60 p-4 lg:block">
          <Skeleton className="h-10 w-full rounded-lg" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
