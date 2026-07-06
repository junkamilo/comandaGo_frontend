"use client";

import type { CSSProperties, ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckCircle2, GripVertical, MoreVertical, Pencil, Trash2 } from "lucide-react";

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
import type { Categoria } from "@/features/categorias/types/categoria.types";
import { cn } from "@/lib/utils";

interface CategoriaSortableItemProps {
  categoria: Categoria;
  isChild: boolean;
  sortable: boolean;
  onEditar: (categoria: Categoria) => void;
  onDesactivar: (categoria: Categoria) => void;
  onActivar: (categoria: Categoria) => void;
}

export function CategoriaSortableItem({
  categoria,
  isChild,
  sortable,
  onEditar,
  onDesactivar,
  onActivar,
}: CategoriaSortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: categoria.id,
    disabled: !sortable,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <CategoriaRow
        categoria={categoria}
        isChild={isChild}
        sortable={sortable}
        dragHandle={
          sortable ? (
            <button
              type="button"
              className="mt-0.5 shrink-0 cursor-grab touch-none rounded p-1 text-muted-foreground hover:bg-muted active:cursor-grabbing"
              aria-label={`Reordenar ${categoria.nombre}`}
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4" />
            </button>
          ) : null
        }
        onEditar={onEditar}
        onDesactivar={onDesactivar}
        onActivar={onActivar}
      />
    </div>
  );
}

interface CategoriaRowProps {
  categoria: Categoria;
  isChild: boolean;
  sortable: boolean;
  dragHandle: ReactNode;
  onEditar: (categoria: Categoria) => void;
  onDesactivar: (categoria: Categoria) => void;
  onActivar: (categoria: Categoria) => void;
}

function CategoriaRow({
  categoria,
  isChild,
  dragHandle,
  onEditar,
  onDesactivar,
  onActivar,
}: CategoriaRowProps) {
  return (
    <Card
      className={cn(
        "border-border/60 bg-card/80",
        isChild && "ml-4 border-l-2 border-l-primary/30 sm:ml-8",
      )}
    >
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          {dragHandle}
          <EntityImage src={categoria.imagenUrl} alt={categoria.nombre} size="sm" />
          <div className="min-w-0">
            <p className="font-semibold">{categoria.nombre}</p>
            {categoria.descripcion && (
              <p className="line-clamp-2 text-sm text-muted-foreground">{categoria.descripcion}</p>
            )}
            {categoria.categoriaPadreNombre && (
              <p className="mt-1 text-xs text-muted-foreground">
                Subcategoría de {categoria.categoriaPadreNombre}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 sm:justify-end">
          <Badge variant={categoria.activo ? "default" : "secondary"}>
            {categoria.activo ? "Activa" : "Inactiva"}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Acciones</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEditar(categoria)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              {categoria.activo ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => onDesactivar(categoria)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Desactivar
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onActivar(categoria)}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Activar
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

export function CategoriaStaticItem({
  categoria,
  isChild,
  onEditar,
  onDesactivar,
  onActivar,
}: Omit<CategoriaSortableItemProps, "sortable">) {
  return (
    <CategoriaRow
      categoria={categoria}
      isChild={isChild}
      sortable={false}
      dragHandle={null}
      onEditar={onEditar}
      onDesactivar={onDesactivar}
      onActivar={onActivar}
    />
  );
}
