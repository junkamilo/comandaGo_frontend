"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EditarProductoDialog } from "@/features/productos/components/EditarProductoDialog";
import { NuevoProductoDialog } from "@/features/productos/components/NuevoProductoDialog";
import { ProductosList } from "@/features/productos/components/ProductosList";
import { useCategorias } from "@/features/categorias/hooks/use-categorias";
import { useProductos } from "@/features/productos/hooks/use-productos";
import type { Producto } from "@/features/productos/types/producto.types";

function ProductosListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function ProductosPage() {
  const [nuevoOpen, setNuevoOpen] = useState(false);
  const [editarProducto, setEditarProducto] = useState<Producto | null>(null);

  const { categorias } = useCategorias();
  const { productos, isLoading, isError, refetch } = useProductos();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex shrink-0 justify-end">
        <Button className="h-11 gap-2" onClick={() => setNuevoOpen(true)}>
          <Plus className="h-4 w-4" />
          Nuevo producto
        </Button>
      </div>

      <div className="max-h-[calc(100dvh-9rem)] overflow-y-auto overflow-x-hidden pr-1 md:max-h-[calc(100dvh-10rem)]">
        {isLoading && <ProductosListSkeleton />}

        {isError && (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-center">
            <p className="text-sm text-destructive">No se pudieron cargar los productos.</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
              Reintentar
            </Button>
          </div>
        )}

        {!isLoading && !isError && (
          <ProductosList
            productos={productos}
            categorias={categorias}
            onEditar={setEditarProducto}
            onCrear={() => setNuevoOpen(true)}
          />
        )}
      </div>

      <NuevoProductoDialog open={nuevoOpen} onOpenChange={setNuevoOpen} />

      <EditarProductoDialog
        producto={editarProducto}
        open={editarProducto !== null}
        onOpenChange={(open) => !open && setEditarProducto(null)}
      />
    </div>
  );
}
