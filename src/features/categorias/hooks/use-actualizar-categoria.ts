"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { actualizarCategoria } from "@/features/categorias/api/categorias.api";
import type { EditarCategoriaFormValues } from "@/features/categorias/schemas/categoria.schemas";
import { ApiError } from "@/lib/api-error";

export interface ActualizarCategoriaPayload {
  id: number;
  values: EditarCategoriaFormValues;
  imagenUrl?: string | null;
  imagenEliminada?: boolean;
}

function toRequest({ values, imagenUrl, imagenEliminada }: Omit<ActualizarCategoriaPayload, "id">) {
  const body: {
    nombre: string;
    descripcion?: string;
    categoriaPadreId?: number;
    imagenUrl?: string;
  } = {
    nombre: values.nombre.trim(),
    descripcion: values.descripcion?.trim() || undefined,
    categoriaPadreId: values.categoriaPadreId === "none" ? undefined : values.categoriaPadreId,
  };

  if (imagenEliminada) {
    body.imagenUrl = "";
  } else if (imagenUrl) {
    body.imagenUrl = imagenUrl;
  }

  return body;
}

export function useActualizarCategoria(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, ...payload }: ActualizarCategoriaPayload) =>
      actualizarCategoria(id, toRequest(payload)),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      queryClient.invalidateQueries({ queryKey: ["categorias", "menu"] });
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
    actualizarCategoriaAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    fieldErrors: mutation.error instanceof ApiError ? mutation.error.fieldErrors : undefined,
    reset: mutation.reset,
  };
}
