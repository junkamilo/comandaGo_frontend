"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EditarProductoDialog } from "@/features/productos/components/EditarProductoDialog";
import { NuevoProductoDialog } from "@/features/productos/components/NuevoProductoDialog";
import { ProductosList } from "@/features/productos/components/ProductosList";
import { useCategorias } from "@/features/categorias/hooks/use-categorias";
import { useProductos } from "@/features/productos/hooks/use-productos";
import type { Producto, TipoProducto } from "@/features/productos/types/producto.types";

function ProductosListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-xl" />
      ))}
    </div>
  );
}

type FiltroTipo = "TODOS" | TipoProducto;

export function ProductosPage() {
  const [nuevoOpen, setNuevoOpen] = useState(false);
  const [editarProducto, setEditarProducto] = useState<Producto | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>("TODOS");

  const { categorias } = useCategorias();
  const { productos, isLoading, isError, refetch } = useProductos();

  const productosFiltrados = useMemo(() => {
    if (filtroTipo === "TODOS") return productos;
    return productos.filter((p) => (p.tipo ?? "NORMAL") === filtroTipo);
  }, [productos, filtroTipo]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
        <Select value={filtroTipo} onValueChange={(v) => setFiltroTipo(v as FiltroTipo)}>
          <SelectTrigger className="h-11 w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos los tipos</SelectItem>
            <SelectItem value="NORMAL">Normal</SelectItem>
            <SelectItem value="COMPUESTO">Compuesto</SelectItem>
            <SelectItem value="INSUMO">Insumo</SelectItem>
          </SelectContent>
        </Select>
        <Button className="h-11 gap-2" onClick={() => setNuevoOpen(true)}>
          <Plus className="h-4 w-4" />
          Nuevo producto
        </Button>
      </div>

      <div className="min-w-0">
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
            productos={productosFiltrados}
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
