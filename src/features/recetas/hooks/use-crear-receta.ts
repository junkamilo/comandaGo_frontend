"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { crearReceta } from "@/features/recetas/api/recetas.api";
import type { CrearRecetaFormValues } from "@/features/recetas/schemas/receta.schemas";
import { toRecetaRequest } from "@/features/recetas/utils/receta-helpers";
import { ApiError } from "@/lib/api-error";

export function useCrearReceta(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: CrearRecetaFormValues) => crearReceta(toRecetaRequest(values)),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["recetas"] });
      toast.success("Receta creada", { description: data.nombre });
      onSuccess?.();
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && !error.fieldErrors?.length) {
        toast.error(error.message);
      }
    },
  });

  return {
    crearReceta: mutation.mutate,
    crearRecetaAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    fieldErrors: mutation.error instanceof ApiError ? mutation.error.fieldErrors : undefined,
    reset: mutation.reset,
  };
}
