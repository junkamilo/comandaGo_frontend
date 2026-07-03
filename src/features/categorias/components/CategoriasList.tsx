"use client";

import { useState } from "react";
import { CheckCircle2, FolderTree, MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { useCategoriaActivo } from "@/features/categorias/hooks/use-categoria-activo";
import type { Categoria } from "@/features/categorias/types/categoria.types";
import { buildCategoriasJerarquia } from "@/features/categorias/utils/categoria-helpers";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CategoriasListProps {
  categorias: Categoria[];
  onEditar: (categoria: Categoria) => void;
  onCrear: () => void;
}

export function CategoriasList({ categorias, onEditar, onCrear }: CategoriasListProps) {
  const [desactivarTarget, setDesactivarTarget] = useState<Categoria | null>(null);
  const { desactivarCategoria, toggleActivo, isDesactivando } = useCategoriaActivo(() =>
    setDesactivarTarget(null),
  );

  const jerarquia = buildCategoriasJerarquia(categorias);

  function confirmarDesactivar() {
    if (!desactivarTarget) return;
    desactivarCategoria(desactivarTarget.id);
  }

  function activarCategoria(categoria: Categoria) {
    if (categoria.categoriaPadreId) {
      const padre = categorias.find((c) => c.id === categoria.categoriaPadreId);
      if (padre && !padre.activo) {
        toast.error("Activa primero la categoría padre antes de reactivar esta subcategoría.");
        return;
      }
    }
    toggleActivo({ id: categoria.id, activo: true });
  }

  if (jerarquia.length === 0) {
    return (
      <EmptyState
        centered
        icon={FolderTree}
        title="No hay categorías aún"
        description="Organiza tu carta creando categorías principales y subcategorías para el menú del POS."
        action={{
          label: "Crear primera categoría",
          onClick: onCrear,
          icon: Plus,
        }}
      />
    );
  }

  return (
    <>
      <div className="space-y-3">
        {jerarquia.map(({ categoria, isChild }) => (
          <Card
            key={categoria.id}
            className={cn(
              "border-border/60 bg-card/80",
              isChild && "ml-4 border-l-2 border-l-primary/30 sm:ml-8",
            )}
          >
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <FolderTree className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold">{categoria.nombre}</p>
                  {categoria.descripcion && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {categoria.descripcion}
                    </p>
                  )}
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>Orden: {categoria.orden}</span>
                    {categoria.categoriaPadreNombre && (
                      <span>· Subcategoría de {categoria.categoriaPadreNombre}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 sm:justify-end">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={categoria.activo ? "default" : "secondary"}>
                    {categoria.activo ? "Activa" : "Inactiva"}
                  </Badge>
                </div>

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
                          onClick={() => setDesactivarTarget(categoria)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Desactivar
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => activarCategoria(categoria)}>
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
        ))}
      </div>

      <AlertDialog
        open={desactivarTarget !== null}
        onOpenChange={(open) => !open && setDesactivarTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desactivar categoría?</AlertDialogTitle>
            <AlertDialogDescription>
              {desactivarTarget?.nombre} dejará de mostrarse en el menú. No se puede desactivar si
              tiene productos o subcategorías activas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmarDesactivar}
              disabled={isDesactivando}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Desactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
