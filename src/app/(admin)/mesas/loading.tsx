import { Skeleton } from "@/components/ui/skeleton";
import { MesasGridSkeleton } from "@/features/mesas/components/MesasGridSkeleton";

export default function MesasLoading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end gap-2">
        <Skeleton className="h-11 w-32" />
        <Skeleton className="h-11 w-36" />
      </div>
      <MesasGridSkeleton />
    </div>
  );
}
