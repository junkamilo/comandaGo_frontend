"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { actualizarProducto } from "@/features/productos/api/productos.api";
import type { EditarProductoFormValues } from "@/features/productos/schemas/producto.schemas";
import type { ActualizarProductoRequest } from "@/features/productos/types/producto.types";
import { ApiError } from "@/lib/api-error";

export interface ActualizarProductoPayload {
  id: number;
  values: EditarProductoFormValues;
  imagenUrl?: string | null;
  imagenEliminada?: boolean;
}

function toRequest({
  values,
  imagenUrl,
  imagenEliminada,
}: Omit<ActualizarProductoPayload, "id">): ActualizarProductoRequest {
  const sinCategoria =
    values.tipo === "INSUMO" && (values.categoriaId == null || values.categoriaId <= 0);

  const body: ActualizarProductoRequest = {
    nombre: values.nombre.trim(),
    descripcion: values.descripcion?.trim() || undefined,
    precio: values.precio,
    disponible: values.disponible,
    tipo: values.tipo,
  };

  if (sinCategoria) {
    body.sinCategoria = true;
  } else if (values.categoriaId != null && values.categoriaId > 0) {
    body.categoriaId = values.categoriaId;
  }

  if (values.tipo === "COMPUESTO" && values.recetaId != null) {
    body.recetaId = values.recetaId;
  }

  if (imagenEliminada) {
    body.imagenUrl = "";
  } else if (imagenUrl) {
    body.imagenUrl = imagenUrl;
  }

  return body;
}

export function useActualizarProducto(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, ...payload }: ActualizarProductoPayload) =>
      actualizarProducto(id, toRequest(payload)),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      toast.success("Producto actualizado", { description: data.nombre });
      onSuccess?.();
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && !error.fieldErrors?.length) {
        toast.error(error.message);
      }
    },
  });

  return {
    actualizarProducto: mutation.mutate,
    actualizarProductoAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    fieldErrors: mutation.error instanceof ApiError ? mutation.error.fieldErrors : undefined,
    reset: mutation.reset,
  };
}
