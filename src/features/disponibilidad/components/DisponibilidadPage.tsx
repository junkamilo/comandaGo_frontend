"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MenuDelDiaList } from "@/features/disponibilidad/components/MenuDelDiaList";
import { useMenuDelDia } from "@/features/disponibilidad/hooks/use-menu-del-dia";
import { agruparMenuDelDia } from "@/features/disponibilidad/utils/menu-del-dia-helpers";

function MenuDelDiaSkeleton() {
  return (
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
  );
}

export function DisponibilidadPage() {
  const { productos, isLoading, isError, refetch } = useMenuDelDia();
  const grupos = agruparMenuDelDia(productos);

  return (
    <div className="flex flex-col gap-4">
      <p className="shrink-0 text-sm text-muted-foreground">
        Marca los productos agotados hoy. Los cambios no eliminan el producto de la carta.
      </p>

      <div className="max-h-[calc(100dvh-8rem)] overflow-y-auto overflow-x-hidden pr-1 md:max-h-[calc(100dvh-9rem)]">
        {isLoading && <MenuDelDiaSkeleton />}

        {isError && (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-center">
            <p className="text-sm text-destructive">No se pudo cargar el menú del día.</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
              Reintentar
            </Button>
          </div>
        )}

        {!isLoading && !isError && <MenuDelDiaList grupos={grupos} />}
      </div>
    </div>
  );
}
