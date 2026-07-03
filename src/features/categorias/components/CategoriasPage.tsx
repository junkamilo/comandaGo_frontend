"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoriasList } from "@/features/categorias/components/CategoriasList";
import { EditarCategoriaDialog } from "@/features/categorias/components/EditarCategoriaDialog";
import { NuevaCategoriaDialog } from "@/features/categorias/components/NuevaCategoriaDialog";
import { useCategorias } from "@/features/categorias/hooks/use-categorias";
import type { Categoria } from "@/features/categorias/types/categoria.types";

function CategoriasListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function CategoriasPage() {
  const [nuevoOpen, setNuevoOpen] = useState(false);
  const [editarCategoria, setEditarCategoria] = useState<Categoria | null>(null);

  const { categorias, isLoading, isError, refetch } = useCategorias();

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="h-11 gap-2" onClick={() => setNuevoOpen(true)}>
          <Plus className="h-4 w-4" />
          Nueva categoría
        </Button>
      </div>

      {isLoading && <CategoriasListSkeleton />}

      {isError && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-center">
          <p className="text-sm text-destructive">No se pudieron cargar las categorías.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
            Reintentar
          </Button>
        </div>
      )}

      {!isLoading && !isError && (
        <CategoriasList
          categorias={categorias}
          onEditar={setEditarCategoria}
          onCrear={() => setNuevoOpen(true)}
        />
      )}

      <NuevaCategoriaDialog open={nuevoOpen} onOpenChange={setNuevoOpen} />

      <EditarCategoriaDialog
        categoria={editarCategoria}
        open={editarCategoria !== null}
        onOpenChange={(open) => !open && setEditarCategoria(null)}
      />
    </div>
  );
}
