import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriasLoading() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Skeleton className="h-11 w-40" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
