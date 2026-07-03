import { Skeleton } from "@/components/ui/skeleton";

export function PosSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="border-b border-border/60 px-3 py-2 md:hidden">
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <div className="hidden w-52 shrink-0 space-y-2 border-r border-border/60 p-3 md:block lg:w-56">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="border-b border-border/60 px-3 py-2 md:hidden">
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 shrink-0 rounded-full" />
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-3 p-3 pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:p-4 md:pb-4">
            <Skeleton className="h-10 w-full max-w-sm rounded-lg" />
            <div className="grid grid-cols-2 gap-2 sm:gap-3 xl:grid-cols-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))}
            </div>
          </div>
        </div>

        <div className="hidden w-80 shrink-0 space-y-3 border-l border-border/60 p-4 md:block lg:w-96">
          <Skeleton className="h-10 w-full rounded-lg" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-border/60 bg-card/95 p-3 md:hidden">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
