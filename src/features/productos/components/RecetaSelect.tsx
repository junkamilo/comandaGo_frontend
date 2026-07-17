"use client";

import { formatDurationMinutes } from "@/components/date-time";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRecetasActivas } from "@/features/recetas/hooks/use-recetas-activas";

interface RecetaSelectProps {
  value: number | null | undefined;
  onChange: (value: number | null) => void;
  disabled?: boolean;
  enabled?: boolean;
}

export function RecetaSelect({
  value,
  onChange,
  disabled,
  enabled = true,
}: RecetaSelectProps) {
  const { recetas, isLoading } = useRecetasActivas(enabled);
  const seleccionada = recetas.find((r) => r.id === value);

  return (
    <div className="space-y-1.5">
      <Select
        value={value ? String(value) : undefined}
        onValueChange={(v) => onChange(Number(v))}
        disabled={disabled || isLoading || recetas.length === 0}
      >
        <SelectTrigger className="h-11">
          <SelectValue
            placeholder={
              isLoading
                ? "Cargando recetas…"
                : recetas.length === 0
                  ? "No hay recetas activas"
                  : "Selecciona una receta"
            }
          />
        </SelectTrigger>
        <SelectContent>
          {recetas.map((receta) => {
            const partes: string[] = [];
            if (receta.totalIngredientes != null) {
              partes.push(`${receta.totalIngredientes} ing.`);
            }
            if (receta.tiempoTotalMin != null) {
              partes.push(formatDurationMinutes(receta.tiempoTotalMin));
            }
            const sufijo = partes.length > 0 ? ` (${partes.join(" · ")})` : "";
            return (
              <SelectItem key={receta.id} value={String(receta.id)}>
                {receta.nombre}
                {sufijo}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {seleccionada?.tiempoTotalMin != null && (
        <p className="text-xs text-muted-foreground">
          Tiempo de preparación: {formatDurationMinutes(seleccionada.tiempoTotalMin)}
        </p>
      )}
    </div>
  );
}
