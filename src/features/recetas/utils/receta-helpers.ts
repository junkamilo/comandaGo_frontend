import { formatDurationMinutes } from "@/components/date-time";
import type { CrearRecetaFormValues } from "@/features/recetas/schemas/receta.schemas";
import type { IngredienteRequest, RecetaRequest, UnidadInsumo } from "@/features/recetas/types/receta.types";

export function toRecetaRequest(values: CrearRecetaFormValues): RecetaRequest {
  const ingredientes: IngredienteRequest[] = (values.ingredientes ?? []).map(
    (
      linea: {
        productoId: number;
        cantidad: number;
        unidad: UnidadInsumo;
        esRemovible: boolean;
        orden: number;
      },
      index: number,
    ) => ({
      productoId: Number(linea.productoId),
      cantidad: Number(linea.cantidad),
      unidad: linea.unidad,
      esRemovible: Boolean(linea.esRemovible),
      orden: linea.orden ?? index,
    }),
  );

  return {
    nombre: values.nombre.trim(),
    descripcion: values.descripcion?.trim() || undefined,
    preparacion: values.preparacion?.trim() || undefined,
    tiempoTotalMin: values.tiempoTotalMin ?? undefined,
    activo: values.activo,
    ingredientes,
  };
}

export function formatRecetaResumen(tiempoTotalMin: number | null | undefined) {
  if (tiempoTotalMin != null) return formatDurationMinutes(tiempoTotalMin);
  return "Sin tiempo definido";
}
