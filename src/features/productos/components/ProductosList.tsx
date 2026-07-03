"use client";

import { useState } from "react";
import { MoreVertical, Pencil, Plus, Trash2, UtensilsCrossed } from "lucide-react";

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
import { useEliminarProducto } from "@/features/productos/hooks/use-eliminar-producto";
import type { Producto } from "@/features/productos/types/producto.types";
import { formatProductoCategoriaRuta } from "@/features/productos/utils/producto-helpers";
import { formatCOP } from "@/lib/format-cop";

interface ProductosListProps {
  productos: Producto[];
  onEditar: (producto: Producto) => void;
  onCrear: () => void;
}

export function ProductosList({ productos, onEditar, onCrear }: ProductosListProps) {
  const [eliminarTarget, setEliminarTarget] = useState<Producto | null>(null);
  const { eliminarProducto, isPending: isEliminando } = useEliminarProducto(() =>
    setEliminarTarget(null),
  );

  function confirmarEliminar() {
    if (!eliminarTarget) return;
    eliminarProducto(eliminarTarget.id);
  }

  if (productos.length === 0) {
    return (
      <div className="flex min-h-[calc(100dvh-9rem)] items-center justify-center py-8 md:min-h-[calc(100dvh-10rem)]">
        <div className="w-full max-w-lg">
          <EmptyState
            icon={UtensilsCrossed}
            title="No hay productos aún"
            description="Crea tu primer producto y asígnalo a una categoría hoja del menú."
            action={{
              label: "Crear primer producto",
              onClick: onCrear,
              icon: Plus,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 pb-1">
        {productos.map((producto) => (
          <Card key={producto.id} className="border-border/60 bg-card/80">
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <UtensilsCrossed className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold">{producto.nombre}</p>
                  {producto.descripcion && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {producto.descripcion}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatProductoCategoriaRuta(
                      producto.categoriaNombre,
                      producto.categoriaPadreNombre,
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 sm:justify-end">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-lg font-bold text-primary">{formatCOP(producto.precioFinal)}</p>
                  {producto.esPromocion && <Badge variant="secondary">Promoción</Badge>}
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
                          onClick={() => setEliminarTarget(producto)}
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
        ))}
      </div>

      <AlertDialog
        open={eliminarTarget !== null}
        onOpenChange={(open) => !open && setEliminarTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto del menú?</AlertDialogTitle>
            <AlertDialogDescription>
              {eliminarTarget?.nombre} dejará de mostrarse en el menú de forma permanente. Esta
              acción no se puede deshacer desde la interfaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmarEliminar}
              disabled={isEliminando}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar del menú
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
