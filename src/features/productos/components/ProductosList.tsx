"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, UtensilsCrossed } from "lucide-react";

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
import type { Categoria } from "@/features/categorias/types/categoria.types";
import {
  ProductoSortableItem,
  ProductoStaticItem,
} from "@/features/productos/components/ProductoSortableItem";
import { useEliminarProducto } from "@/features/productos/hooks/use-eliminar-producto";
import { useReordenarProductos } from "@/features/productos/hooks/use-reordenar-productos";
import type { Producto } from "@/features/productos/types/producto.types";
import {
  categoriaContainerId,
  formatProductoCategoriaRuta,
  groupProductosPorCategoria,
  sortCategoriaIdsPorOrden,
} from "@/features/productos/utils/producto-helpers";

interface ProductosListProps {
  productos: Producto[];
  categorias: Categoria[];
  onEditar: (producto: Producto) => void;
  onCrear: () => void;
}

export function ProductosList({ productos, categorias, onEditar, onCrear }: ProductosListProps) {
  const [eliminarTarget, setEliminarTarget] = useState<Producto | null>(null);
  const { eliminarProducto, isPending: isEliminando } = useEliminarProducto(() =>
    setEliminarTarget(null),
  );
  const { reordenarProductosAsync, isReordenando } = useReordenarProductos();

  const grupos = useMemo(() => groupProductosPorCategoria(productos), [productos]);
  const categoriaIds = useMemo(
    () => sortCategoriaIdsPorOrden([...grupos.keys()], categorias),
    [grupos, categorias],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function confirmarEliminar() {
    if (!eliminarTarget) return;
    eliminarProducto(eliminarTarget.id);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || isReordenando) return;

    const activeContainer = active.data.current?.sortable?.containerId as string | undefined;
    const overContainer = over.data.current?.sortable?.containerId as string | undefined;
    if (!activeContainer || activeContainer !== overContainer) return;
    if (!activeContainer.startsWith("categoria-")) return;

    const categoriaId = Number(activeContainer.replace("categoria-", ""));
    const productosEnCategoria = grupos.get(categoriaId) ?? [];
    const activos = productosEnCategoria.filter((p) => p.activo);
    const ids = activos.map((p) => p.id);
    const oldIndex = ids.indexOf(Number(active.id));
    const newIndex = ids.indexOf(Number(over.id));
    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

    await reordenarProductosAsync({
      ids: arrayMove(ids, oldIndex, newIndex),
      categoriaId,
    });
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
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="space-y-6 pb-1">
          {categoriaIds.map((categoriaId) => {
            const productosEnCategoria = grupos.get(categoriaId) ?? [];
            const primerProducto = productosEnCategoria[0];
            const activosIds = productosEnCategoria.filter((p) => p.activo).map((p) => p.id);
            const containerId = categoriaContainerId(categoriaId);

            return (
              <section key={categoriaId} className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {primerProducto
                    ? formatProductoCategoriaRuta(
                        primerProducto.categoriaNombre,
                        primerProducto.categoriaPadreNombre,
                      )
                    : `Categoría ${categoriaId}`}
                </h3>

                <SortableContext
                  id={containerId}
                  items={activosIds}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {productosEnCategoria.map((producto) =>
                      producto.activo ? (
                        <ProductoSortableItem
                          key={producto.id}
                          producto={producto}
                          sortable
                          onEditar={onEditar}
                          onEliminar={setEliminarTarget}
                        />
                      ) : (
                        <ProductoStaticItem
                          key={producto.id}
                          producto={producto}
                          onEditar={onEditar}
                          onEliminar={setEliminarTarget}
                        />
                      ),
                    )}
                  </div>
                </SortableContext>
              </section>
            );
          })}
        </div>
      </DndContext>

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
