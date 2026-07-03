"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { crearProducto } from "@/features/productos/api/productos.api";
import type { CrearProductoFormValues } from "@/features/productos/schemas/producto.schemas";
import { ApiError } from "@/lib/api-error";

function toRequest(values: CrearProductoFormValues) {
  return {
    categoriaId: values.categoriaId,
    nombre: values.nombre.trim(),
    descripcion: values.descripcion?.trim() || undefined,
    precio: values.precio,
    esPromocion: values.esPromocion,
    precioPromocion: values.esPromocion ? values.precioPromocion : undefined,
    imagenUrl: values.imagenUrl?.trim() || undefined,
    tiempoPreparacionMin: values.tiempoPreparacionMin,
    orden: values.orden,
  };
}

export function useCrearProducto(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: CrearProductoFormValues) => crearProducto(toRequest(values)),
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
    isPending: mutation.isPending,
    fieldErrors: mutation.error instanceof ApiError ? mutation.error.fieldErrors : undefined,
    reset: mutation.reset,
  };
}
