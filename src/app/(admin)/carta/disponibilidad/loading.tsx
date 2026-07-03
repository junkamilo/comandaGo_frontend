import { Skeleton } from "@/components/ui/skeleton";

export default function DisponibilidadLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-5 w-full max-w-md" />
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-5 w-32" />
            {Array.from({ length: 2 }).map((_, j) => (
              <Skeleton key={j} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
