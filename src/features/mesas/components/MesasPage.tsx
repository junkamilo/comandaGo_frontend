"use client";

import { useState } from "react";
import { Link2, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EditarMesaDialog } from "@/features/mesas/components/EditarMesaDialog";
import { MesasGridSkeleton } from "@/features/mesas/components/MesasGridSkeleton";
import { MesasPisoGrid } from "@/features/mesas/components/MesasPisoGrid";
import { NuevaMesaDialog } from "@/features/mesas/components/NuevaMesaDialog";
import { useAgruparMesas } from "@/features/mesas/hooks/use-agrupar-mesas";
import { useMesasPiso } from "@/features/mesas/hooks/use-mesas-piso";
import type { Mesa } from "@/features/mesas/types/mesa.types";
import { toast } from "sonner";

export function MesasPage() {
  const [nuevoOpen, setNuevoOpen] = useState(false);
  const [editarMesa, setEditarMesa] = useState<Mesa | null>(null);
  const [modoAgrupar, setModoAgrupar] = useState(false);
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);

  const { mesas, isLoading, isError, refetch } = useMesasPiso();

  const { agruparMesas, isPending: isAgrupando } = useAgruparMesas(() => {
    setModoAgrupar(false);
    setSeleccionadas([]);
  });

  function toggleSeleccion(id: number) {
    setSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function cancelarAgrupar() {
    setModoAgrupar(false);
    setSeleccionadas([]);
  }

  function confirmarAgrupar() {
    if (seleccionadas.length < 2) {
      toast.error("Selecciona al menos 2 mesas libres para agrupar");
      return;
    }
    agruparMesas(seleccionadas);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Vista del piso: mesas activas con estado y grupos. La capacidad es solo referencia.
        </p>
        <div className="flex flex-wrap gap-2">
          {modoAgrupar ? (
            <>
              <Button
                variant="outline"
                className="h-11 gap-2"
                onClick={cancelarAgrupar}
                disabled={isAgrupando}
              >
                <X className="h-4 w-4" />
                Cancelar
              </Button>
              <Button
                className="h-11 gap-2"
                onClick={confirmarAgrupar}
                disabled={isAgrupando || seleccionadas.length < 2}
              >
                <Link2 className="h-4 w-4" />
                Pegar mesas ({seleccionadas.length})
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="h-11 gap-2"
                onClick={() => setModoAgrupar(true)}
                disabled={mesas.length < 2}
              >
                <Link2 className="h-4 w-4" />
                Pegar mesas
              </Button>
              <Button className="h-11 gap-2" onClick={() => setNuevoOpen(true)}>
                <Plus className="h-4 w-4" />
                Nueva mesa
              </Button>
            </>
          )}
        </div>
      </div>

      {modoAgrupar && (
        <p className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-muted-foreground">
          Selecciona 2 o más mesas libres (sin grupo) para unirlas temporalmente.
        </p>
      )}

      <div className="max-h-[calc(100dvh-10rem)] overflow-y-auto overflow-x-hidden pr-1 md:max-h-[calc(100dvh-11rem)]">
        {isLoading && <MesasGridSkeleton />}

        {isError && (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-center">
            <p className="text-sm text-destructive">No se pudieron cargar las mesas.</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
              Reintentar
            </Button>
          </div>
        )}

        {!isLoading && !isError && (
          <MesasPisoGrid
            mesas={mesas}
            modoAgrupar={modoAgrupar}
            seleccionadas={seleccionadas}
            onToggleSeleccion={toggleSeleccion}
            onEditar={setEditarMesa}
            onCrear={() => setNuevoOpen(true)}
          />
        )}
      </div>

      <NuevaMesaDialog open={nuevoOpen} onOpenChange={setNuevoOpen} />

      <EditarMesaDialog
        mesa={editarMesa}
        open={editarMesa !== null}
        onOpenChange={(open) => !open && setEditarMesa(null)}
      />
    </div>
  );
}
