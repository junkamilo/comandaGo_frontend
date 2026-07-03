"use client";

import { Plus, Table2 } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { MesaCard } from "@/features/mesas/components/MesaCard";
import type { Mesa } from "@/features/mesas/types/mesa.types";

interface MesasPisoGridProps {
  mesas: Mesa[];
  modoAgrupar: boolean;
  seleccionadas: number[];
  onToggleSeleccion: (id: number) => void;
  onEditar: (mesa: Mesa) => void;
  onCrear: () => void;
}

export function MesasPisoGrid({
  mesas,
  modoAgrupar,
  seleccionadas,
  onToggleSeleccion,
  onEditar,
  onCrear,
}: MesasPisoGridProps) {
  if (mesas.length === 0) {
    return (
      <EmptyState
        centered
        icon={Table2}
        title="No hay mesas en el piso"
        description="Crea mesas para gestionar el salón, generar códigos QR y agruparlas cuando sea necesario."
        action={{
          label: "Crear primera mesa",
          onClick: onCrear,
          icon: Plus,
        }}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 pb-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {mesas.map((mesa) => (
        <MesaCard
          key={mesa.id}
          mesa={mesa}
          modoAgrupar={modoAgrupar}
          seleccionada={seleccionadas.includes(mesa.id)}
          onToggleSeleccion={onToggleSeleccion}
          onEditar={onEditar}
        />
      ))}
    </div>
  );
}
