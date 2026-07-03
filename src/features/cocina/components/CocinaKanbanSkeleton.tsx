import { Skeleton } from "@/components/ui/skeleton";

const COLUMNAS = ["Pendiente", "Preparando", "Listo"];

export function CocinaKanbanSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {COLUMNAS.map((col) => (
        <div key={col} className="space-y-3 rounded-xl border border-border/60 p-4">
          <Skeleton className="h-5 w-24" />
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ))}
    </div>
  );
}
