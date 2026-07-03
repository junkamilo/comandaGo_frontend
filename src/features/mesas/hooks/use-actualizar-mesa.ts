"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { actualizarMesa } from "@/features/mesas/api/mesas.api";
import { invalidateMesasQueries } from "@/features/mesas/hooks/mesas-query-keys";
import type { EditarMesaFormValues } from "@/features/mesas/schemas/mesa.schemas";
import { ApiError } from "@/lib/api-error";

function toRequest(values: EditarMesaFormValues) {
  return {
    numero: values.numero.trim(),
    nombre: values.nombre?.trim() || undefined,
    capacidad: values.capacidad,
  };
}

export function useActualizarMesa(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: EditarMesaFormValues }) =>
      actualizarMesa(id, toRequest(values)),
    onSuccess: (data) => {
      invalidateMesasQueries(queryClient);
      toast.success("Mesa actualizada", { description: `Mesa ${data.numero}` });
      onSuccess?.();
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && !error.fieldErrors?.length) {
        toast.error(error.message);
      }
    },
  });

  return {
    actualizarMesa: mutation.mutate,
    isPending: mutation.isPending,
    fieldErrors: mutation.error instanceof ApiError ? mutation.error.fieldErrors : undefined,
    reset: mutation.reset,
  };
}
