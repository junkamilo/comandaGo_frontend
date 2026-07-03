"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { crearCategoria } from "@/features/categorias/api/categorias.api";
import type { CrearCategoriaFormValues } from "@/features/categorias/schemas/categoria.schemas";
import { ApiError } from "@/lib/api-error";

function toRequest(values: CrearCategoriaFormValues) {
  return {
    nombre: values.nombre.trim(),
    descripcion: values.descripcion?.trim() || undefined,
    imagenUrl: values.imagenUrl?.trim() || undefined,
    orden: values.orden,
    categoriaPadreId: values.categoriaPadreId === "none" ? undefined : values.categoriaPadreId,
  };
}

export function useCrearCategoria(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: CrearCategoriaFormValues) => crearCategoria(toRequest(values)),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
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
    isPending: mutation.isPending,
    fieldErrors: mutation.error instanceof ApiError ? mutation.error.fieldErrors : undefined,
    reset: mutation.reset,
  };
}
