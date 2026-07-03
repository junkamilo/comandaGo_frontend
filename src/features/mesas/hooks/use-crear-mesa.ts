"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { crearMesa } from "@/features/mesas/api/mesas.api";
import {
  invalidateMesasQueries,
} from "@/features/mesas/hooks/mesas-query-keys";
import type { CrearMesaFormValues } from "@/features/mesas/schemas/mesa.schemas";
import { ApiError } from "@/lib/api-error";

function toRequest(values: CrearMesaFormValues) {
  return {
    numero: values.numero.trim(),
    nombre: values.nombre?.trim() || undefined,
    capacidad: values.capacidad,
  };
}

export function useCrearMesa(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: CrearMesaFormValues) => crearMesa(toRequest(values)),
    onSuccess: (data) => {
      invalidateMesasQueries(queryClient);
      toast.success("Mesa creada", { description: `Mesa ${data.numero}` });
      onSuccess?.();
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && !error.fieldErrors?.length) {
        toast.error(error.message);
      }
    },
  });

  return {
    crearMesa: mutation.mutate,
    isPending: mutation.isPending,
    fieldErrors: mutation.error instanceof ApiError ? mutation.error.fieldErrors : undefined,
    reset: mutation.reset,
  };
}
