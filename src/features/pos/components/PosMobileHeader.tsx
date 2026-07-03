"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Mesa } from "@/features/mesas/types/mesa.types";
import { estadoMesaClass, estadoMesaLabel } from "@/features/mesas/utils/estado-mesa";
import { cn } from "@/lib/utils";

interface PosMobileHeaderProps {
  mesas: Mesa[];
  mesaSeleccionada: number | null;
  mesaActual?: Mesa;
  onMesaChange: (id: number) => void;
}

export function PosMobileHeader({
  mesas,
  mesaSeleccionada,
  mesaActual,
  onMesaChange,
}: PosMobileHeaderProps) {
  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-border/60 px-3 py-2 md:hidden">
      <span className="shrink-0 text-xs font-medium text-muted-foreground">Mesa</span>
      {mesas.length === 0 ? (
        <span className="text-sm text-muted-foreground">Sin mesas</span>
      ) : (
        <Select
          value={mesaSeleccionada != null ? String(mesaSeleccionada) : undefined}
          onValueChange={(value) => onMesaChange(Number(value))}
        >
          <SelectTrigger className="h-9 flex-1">
            <SelectValue placeholder="Mesa" />
          </SelectTrigger>
          <SelectContent>
            {mesas.map((mesa) => (
              <SelectItem key={mesa.id} value={String(mesa.id)}>
                <span className="flex items-center gap-2">
                  {mesa.numero}
                  <span
                    className={cn(
                      "rounded-full border px-1.5 py-0.5 text-[10px]",
                      estadoMesaClass[mesa.estado],
                    )}
                  >
                    {estadoMesaLabel[mesa.estado]}
                  </span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {mesaActual && (
        <span
          className={cn(
            "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium",
            estadoMesaClass[mesaActual.estado],
          )}
        >
          {estadoMesaLabel[mesaActual.estado]}
        </span>
      )}
    </div>
  );
}
