"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { crearCategoria } from "@/features/categorias/api/categorias.api";
import type { CrearCategoriaFormValues } from "@/features/categorias/schemas/categoria.schemas";
import { ApiError } from "@/lib/api-error";

export interface CrearCategoriaPayload {
  values: CrearCategoriaFormValues;
  imagenUrl?: string | null;
}

function toRequest({ values, imagenUrl }: CrearCategoriaPayload) {
  return {
    nombre: values.nombre.trim(),
    descripcion: values.descripcion?.trim() || undefined,
    imagenUrl: imagenUrl ?? undefined,
    categoriaPadreId: values.categoriaPadreId === "none" ? undefined : values.categoriaPadreId,
  };
}

export function useCrearCategoria(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CrearCategoriaPayload) => crearCategoria(toRequest(payload)),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      queryClient.invalidateQueries({ queryKey: ["categorias", "menu"] });
      toast.success("Categoría creada", { description: data.nombre });
      onSuccess?.();
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && !error.fieldErrors?.length) {
        toast.error(error.message);
      }
    },
  });

  return {
    crearCategoria: mutation.mutate,
    crearCategoriaAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    fieldErrors: mutation.error instanceof ApiError ? mutation.error.fieldErrors : undefined,
    reset: mutation.reset,
  };
}
