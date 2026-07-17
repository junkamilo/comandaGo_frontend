"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EditarRecetaDialog } from "@/features/recetas/components/EditarRecetaDialog";
import { NuevaRecetaDialog } from "@/features/recetas/components/NuevaRecetaDialog";
import { RecetasList } from "@/features/recetas/components/RecetasList";
import { useRecetas } from "@/features/recetas/hooks/use-recetas";
import type { Receta } from "@/features/recetas/types/receta.types";

function RecetasListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-28 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function RecetasPage() {
  const [nuevoOpen, setNuevoOpen] = useState(false);
  const [editarReceta, setEditarReceta] = useState<Receta | null>(null);

  const { recetas, isLoading, isError, refetch } = useRecetas();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex shrink-0 justify-end">
        <Button className="h-11 gap-2" onClick={() => setNuevoOpen(true)}>
          <Plus className="h-4 w-4" />
          Nueva receta
        </Button>
      </div>

      <div className="min-w-0">
        {isLoading && <RecetasListSkeleton />}

        {isError && (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-center">
            <p className="text-sm text-destructive">No se pudieron cargar las recetas.</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
              Reintentar
            </Button>
          </div>
        )}

        {!isLoading && !isError && (
          <RecetasList
            recetas={recetas}
            onEditar={setEditarReceta}
            onCrear={() => setNuevoOpen(true)}
          />
        )}
      </div>

      <NuevaRecetaDialog open={nuevoOpen} onOpenChange={setNuevoOpen} />

      <EditarRecetaDialog
        receta={editarReceta}
        open={editarReceta !== null}
        onOpenChange={(open) => !open && setEditarReceta(null)}
      />
    </div>
  );
}
