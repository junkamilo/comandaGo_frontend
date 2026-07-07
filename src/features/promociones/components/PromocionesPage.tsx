"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EditarPromocionDialog } from "@/features/promociones/components/EditarPromocionDialog";
import { NuevaPromocionDialog } from "@/features/promociones/components/NuevaPromocionDialog";
import { PromocionesList } from "@/features/promociones/components/PromocionesList";
import { usePromociones } from "@/features/promociones/hooks/use-promociones";
import type { Promocion } from "@/features/promociones/types/promocion.types";

function PromocionesListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-28 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function PromocionesPage() {
  const [nuevoOpen, setNuevoOpen] = useState(false);
  const [editarPromocion, setEditarPromocion] = useState<Promocion | null>(null);

  const { promociones, isLoading, isError, refetch } = usePromociones();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex shrink-0 justify-end">
        <Button className="h-11 gap-2" onClick={() => setNuevoOpen(true)}>
          <Plus className="h-4 w-4" />
          Nueva promoción
        </Button>
      </div>

      <div className="max-h-[calc(100dvh-9rem)] overflow-y-auto overflow-x-hidden pr-1 md:max-h-[calc(100dvh-10rem)]">
        {isLoading && <PromocionesListSkeleton />}

        {isError && (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-center">
            <p className="text-sm text-destructive">No se pudieron cargar las promociones.</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
              Reintentar
            </Button>
          </div>
        )}

        {!isLoading && !isError && (
          <PromocionesList
            promociones={promociones}
            onEditar={setEditarPromocion}
            onCrear={() => setNuevoOpen(true)}
          />
        )}
      </div>

      <NuevaPromocionDialog open={nuevoOpen} onOpenChange={setNuevoOpen} />

      <EditarPromocionDialog
        promocion={editarPromocion}
        open={editarPromocion != null}
        onOpenChange={(open) => !open && setEditarPromocion(null)}
      />
    </div>
  );
}
