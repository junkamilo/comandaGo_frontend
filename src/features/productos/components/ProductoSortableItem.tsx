"use client";

import type { CSSProperties, ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MoreVertical, Pencil, Trash2 } from "lucide-react";

import { EntityImage } from "@/components/entity-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Producto } from "@/features/productos/types/producto.types";
import { formatCOP } from "@/lib/format-cop";

interface ProductoSortableItemProps {
  producto: Producto;
  sortable: boolean;
  onEditar: (producto: Producto) => void;
  onEliminar: (producto: Producto) => void;
}

export function ProductoSortableItem({
  producto,
  sortable,
  onEditar,
  onEliminar,
}: ProductoSortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: producto.id,
    disabled: !sortable,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ProductoRow
        producto={producto}
        dragHandle={
          sortable ? (
            <button
              type="button"
              className="mt-0.5 shrink-0 cursor-grab touch-none rounded p-1 text-muted-foreground hover:bg-muted active:cursor-grabbing"
              aria-label={`Reordenar ${producto.nombre}`}
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4" />
            </button>
          ) : null
        }
        onEditar={onEditar}
        onEliminar={onEliminar}
      />
    </div>
  );
}

interface ProductoRowProps {
  producto: Producto;
  dragHandle: ReactNode;
  onEditar: (producto: Producto) => void;
  onEliminar: (producto: Producto) => void;
}

function ProductoRow({ producto, dragHandle, onEditar, onEliminar }: ProductoRowProps) {
  return (
    <Card className="border-border/60 bg-card/80">
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          {dragHandle}
          <EntityImage src={producto.imagenUrl} alt={producto.nombre} size="sm" />
          <div className="min-w-0">
            <p className="font-semibold">{producto.nombre}</p>
            {producto.descripcion && (
              <p className="line-clamp-2 text-sm text-muted-foreground">{producto.descripcion}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 sm:justify-end">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-lg font-bold text-primary">{formatCOP(producto.precioFinal)}</p>
            {!producto.disponible && <Badge variant="outline">Agotado</Badge>}
            {!producto.activo && <Badge variant="secondary">Inactivo</Badge>}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Acciones</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEditar(producto)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              {producto.activo && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => onEliminar(producto)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar del menú
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductoStaticItem({
  producto,
  onEditar,
  onEliminar,
}: Omit<ProductoSortableItemProps, "sortable">) {
  return (
    <ProductoRow
      producto={producto}
      dragHandle={null}
      onEditar={onEditar}
      onEliminar={onEliminar}
    />
  );
}
