"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { actualizarPromocion } from "@/features/promociones/api/promociones.api";
import type { EditarPromocionFormValues } from "@/features/promociones/schemas/promocion.schemas";
import type { PromocionRequest } from "@/features/promociones/types/promocion.types";
import { toIsoDateTime } from "@/features/promociones/utils/promocion-helpers";
import { ApiError } from "@/lib/api-error";

export interface ActualizarPromocionPayload {
  id: number;
  values: EditarPromocionFormValues;
}

function toRequest({ values }: Omit<ActualizarPromocionPayload, "id">): PromocionRequest {
  const base: PromocionRequest = {
    nombre: values.nombre.trim(),
    descripcion: values.descripcion?.trim() || undefined,
    tipo: values.tipo,
    fechaInicio: toIsoDateTime(values.fechaInicio),
    fechaFin: values.fechaFin ? toIsoDateTime(values.fechaFin) : undefined,
    usoMaximo: values.usoMaximo,
    activo: values.activo,
    productoIds: values.productoIds,
  };

  switch (values.tipo) {
    case "PORCENTAJE":
      return { ...base, valorPorcentaje: values.valorPorcentaje };
    case "MONTO_FIJO":
      return { ...base, valorMonto: values.valorMonto };
    case "PAGA_X_LLEVA_Y":
      return {
        ...base,
        pagaCantidad: values.pagaCantidad,
        llevaCantidad: values.llevaCantidad,
      };
  }
}

export function useActualizarPromocion(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, values }: ActualizarPromocionPayload) =>
      actualizarPromocion(id, toRequest({ values })),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["promociones"] });
      toast.success("Promoción actualizada", { description: data.nombre });
      onSuccess?.();
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && !error.fieldErrors?.length) {
        toast.error(error.message);
      }
    },
  });

  return {
    actualizarPromocion: mutation.mutate,
    actualizarPromocionAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    fieldErrors: mutation.error instanceof ApiError ? mutation.error.fieldErrors : undefined,
    reset: mutation.reset,
  };
}
