"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { actualizarCategoria } from "@/features/categorias/api/categorias.api";
import type { EditarCategoriaFormValues } from "@/features/categorias/schemas/categoria.schemas";
import { ApiError } from "@/lib/api-error";

function toRequest(values: EditarCategoriaFormValues) {
  return {
    nombre: values.nombre.trim(),
    descripcion: values.descripcion?.trim() || undefined,
    imagenUrl: values.imagenUrl?.trim() || undefined,
    orden: values.orden,
    categoriaPadreId: values.categoriaPadreId === "none" ? undefined : values.categoriaPadreId,
  };
}

export function useActualizarCategoria(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: EditarCategoriaFormValues }) =>
      actualizarCategoria(id, toRequest(values)),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      toast.success("Categoría actualizada", { description: data.nombre });
      onSuccess?.();
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && !error.fieldErrors?.length) {
        toast.error(error.message);
      }
    },
  });

  return {
    actualizarCategoria: mutation.mutate,
    isPending: mutation.isPending,
    fieldErrors: mutation.error instanceof ApiError ? mutation.error.fieldErrors : undefined,
    reset: mutation.reset,
  };
}
