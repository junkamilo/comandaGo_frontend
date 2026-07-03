"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { MesasGridSkeleton } from "@/features/mesas/components/MesasGridSkeleton";
import { type FiltroEstadoMesa } from "@/features/mesas/hooks/use-mesas";
import { useMesasPiso } from "@/features/mesas/hooks/use-mesas-piso";
import { estadoMesaLabel } from "@/features/mesas/utils/estado-mesa";
import { MesaRecepcionCard } from "@/features/recepcion/components/MesaRecepcionCard";
import { RecepcionStats } from "@/features/recepcion/components/RecepcionStats";

const FILTROS: { value: FiltroEstadoMesa; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "LIBRE", label: estadoMesaLabel.LIBRE },
  { value: "RESERVADA", label: estadoMesaLabel.RESERVADA },
  { value: "OCUPADA", label: estadoMesaLabel.OCUPADA },
];

export function RecepcionPage() {
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstadoMesa>("todas");

  const { mesas: mesasPiso, isLoading, isError, refetch } = useMesasPiso();

  const mesasFiltradas = useMemo(() => {
    if (filtroEstado === "todas") return mesasPiso;
    return mesasPiso.filter((m) => m.estado === filtroEstado);
  }, [mesasPiso, filtroEstado]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Gestiona reservas y asignación de mesas para la llegada de clientes.
      </p>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : (
        <RecepcionStats mesas={mesasPiso} />
      )}

      <Select value={filtroEstado} onValueChange={(v) => setFiltroEstado(v as FiltroEstadoMesa)}>
        <SelectTrigger className="h-11 w-full sm:w-48">
          <SelectValue placeholder="Filtrar por estado" />
        </SelectTrigger>
        <SelectContent>
          {FILTROS.map((f) => (
            <SelectItem key={f.value} value={f.value}>
              {f.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isLoading && <MesasGridSkeleton />}

      {isError && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-center">
          <p className="text-sm text-destructive">No se pudieron cargar las mesas.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
            Reintentar
          </Button>
        </div>
      )}

      {!isLoading && !isError && mesasFiltradas.length === 0 && (
        <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-muted-foreground">
          No hay mesas con este filtro.
        </div>
      )}

      {!isLoading && !isError && mesasFiltradas.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {mesasFiltradas.map((mesa) => (
            <MesaRecepcionCard key={mesa.id} mesa={mesa} />
          ))}
        </div>
      )}
    </div>
  );
}
