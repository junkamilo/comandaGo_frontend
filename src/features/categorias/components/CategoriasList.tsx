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
import { Plus } from "lucide-react";
import { toast } from "sonner";

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
import {
  CategoriaSortableItem,
  CategoriaStaticItem,
} from "@/features/categorias/components/CategoriaSortableItem";
import { useCategoriaActivo } from "@/features/categorias/hooks/use-categoria-activo";
import { useReordenarCategorias } from "@/features/categorias/hooks/use-reordenar-categorias";
import type { Categoria } from "@/features/categorias/types/categoria.types";
import {
  getCategoriasPrincipales,
  getSubcategorias,
} from "@/features/categorias/utils/categoria-helpers";

const PADRES_CONTAINER_ID = "padres";

interface CategoriasListProps {
  categorias: Categoria[];
  onEditar: (categoria: Categoria) => void;
  onCrear: () => void;
}

function hijasContainerId(padreId: number) {
  return `hijas-${padreId}`;
}

export function CategoriasList({ categorias, onEditar, onCrear }: CategoriasListProps) {
  const [desactivarTarget, setDesactivarTarget] = useState<Categoria | null>(null);
  const { desactivarCategoria, toggleActivo, isDesactivando } = useCategoriaActivo(() =>
    setDesactivarTarget(null),
  );
  const { reordenarCategoriasAsync, isReordenando } = useReordenarCategorias();

  const padres = useMemo(() => getCategoriasPrincipales(categorias), [categorias]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

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

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || isReordenando) return;

    const activeContainer = active.data.current?.sortable?.containerId as string | undefined;
    const overContainer = over.data.current?.sortable?.containerId as string | undefined;
    if (!activeContainer || activeContainer !== overContainer) return;

    if (activeContainer === PADRES_CONTAINER_ID) {
      const activas = padres.filter((c) => c.activo);
      const ids = activas.map((c) => c.id);
      const oldIndex = ids.indexOf(Number(active.id));
      const newIndex = ids.indexOf(Number(over.id));
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

      await reordenarCategoriasAsync({
        ids: arrayMove(ids, oldIndex, newIndex),
        categoriaPadreId: null,
      });
      return;
    }

    if (activeContainer.startsWith("hijas-")) {
      const padreId = Number(activeContainer.replace("hijas-", ""));
      const hijas = getSubcategorias(categorias, padreId).filter((c) => c.activo);
      const ids = hijas.map((c) => c.id);
      const oldIndex = ids.indexOf(Number(active.id));
      const newIndex = ids.indexOf(Number(over.id));
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

      await reordenarCategoriasAsync({
        ids: arrayMove(ids, oldIndex, newIndex),
        categoriaPadreId: padreId,
      });
    }
  }

  if (padres.length === 0) {
    return (
      <EmptyState
        centered
        icon={Plus}
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

  const padresActivosIds = padres.filter((c) => c.activo).map((c) => c.id);

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          id={PADRES_CONTAINER_ID}
          items={padresActivosIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {padres.map((padre) => {
              const hijas = getSubcategorias(categorias, padre.id);
              const hijasActivasIds = hijas.filter((c) => c.activo).map((c) => c.id);

              return (
                <div key={padre.id} className="space-y-3">
                  {padre.activo ? (
                    <CategoriaSortableItem
                      categoria={padre}
                      isChild={false}
                      sortable
                      onEditar={onEditar}
                      onDesactivar={setDesactivarTarget}
                      onActivar={activarCategoria}
                    />
                  ) : (
                    <CategoriaStaticItem
                      categoria={padre}
                      isChild={false}
                      onEditar={onEditar}
                      onDesactivar={setDesactivarTarget}
                      onActivar={activarCategoria}
                    />
                  )}

                  {hijas.length > 0 && (
                    <SortableContext
                      id={hijasContainerId(padre.id)}
                      items={hijasActivasIds}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3">
                        {hijas.map((hija) =>
                          hija.activo ? (
                            <CategoriaSortableItem
                              key={hija.id}
                              categoria={hija}
                              isChild
                              sortable
                              onEditar={onEditar}
                              onDesactivar={setDesactivarTarget}
                              onActivar={activarCategoria}
                            />
                          ) : (
                            <CategoriaStaticItem
                              key={hija.id}
                              categoria={hija}
                              isChild
                              onEditar={onEditar}
                              onDesactivar={setDesactivarTarget}
                              onActivar={activarCategoria}
                            />
                          ),
                        )}
                      </div>
                    </SortableContext>
                  )}
                </div>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

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
