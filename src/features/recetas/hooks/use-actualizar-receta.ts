"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { actualizarReceta } from "@/features/recetas/api/recetas.api";
import type { EditarRecetaFormValues } from "@/features/recetas/schemas/receta.schemas";
import { toRecetaRequest } from "@/features/recetas/utils/receta-helpers";
import { ApiError } from "@/lib/api-error";

export function useActualizarReceta(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: EditarRecetaFormValues }) =>
      actualizarReceta(id, toRecetaRequest(values)),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["recetas"] });
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      toast.success("Receta actualizada", { description: data.nombre });
      onSuccess?.();
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && !error.fieldErrors?.length) {
        toast.error(error.message);
      }
    },
  });

  return {
    actualizarReceta: mutation.mutate,
    actualizarRecetaAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    fieldErrors: mutation.error instanceof ApiError ? mutation.error.fieldErrors : undefined,
    reset: mutation.reset,
  };
}
