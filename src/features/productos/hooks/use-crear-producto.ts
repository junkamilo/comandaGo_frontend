"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { crearProducto } from "@/features/productos/api/productos.api";
import type { CrearProductoFormValues } from "@/features/productos/schemas/producto.schemas";
import type { CrearProductoRequest } from "@/features/productos/types/producto.types";
import { ApiError } from "@/lib/api-error";

export interface CrearProductoPayload {
  values: CrearProductoFormValues;
  imagenUrl?: string | null;
}

function toRequest({ values, imagenUrl }: CrearProductoPayload): CrearProductoRequest {
  const body: CrearProductoRequest = {
    nombre: values.nombre.trim(),
    descripcion: values.descripcion?.trim() || undefined,
    precio: values.precio,
    imagenUrl: imagenUrl ?? undefined,
    tipo: values.tipo,
  };

  const tieneCategoria = values.categoriaId != null && values.categoriaId > 0;
  if (tieneCategoria) {
    body.categoriaId = values.categoriaId;
  } else if (values.tipo !== "INSUMO") {
    body.categoriaId = values.categoriaId ?? null;
  }

  if (values.tipo === "COMPUESTO" && values.recetaId != null) {
    body.recetaId = values.recetaId;
  }

  return body;
}

export function useCrearProducto(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CrearProductoPayload) => crearProducto(toRequest(payload)),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      toast.success("Producto creado", { description: data.nombre });
      onSuccess?.();
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && !error.fieldErrors?.length) {
        toast.error(error.message);
      }
    },
  });

  return {
    crearProducto: mutation.mutate,
    crearProductoAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    fieldErrors: mutation.error instanceof ApiError ? mutation.error.fieldErrors : undefined,
    reset: mutation.reset,
  };
}
