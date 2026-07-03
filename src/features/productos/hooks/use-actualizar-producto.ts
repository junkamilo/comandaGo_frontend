"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { actualizarProducto } from "@/features/productos/api/productos.api";
import type { EditarProductoFormValues } from "@/features/productos/schemas/producto.schemas";
import { ApiError } from "@/lib/api-error";

function toRequest(values: EditarProductoFormValues) {
  return {
    categoriaId: values.categoriaId,
    nombre: values.nombre.trim(),
    descripcion: values.descripcion?.trim() || undefined,
    precio: values.precio,
    esPromocion: values.esPromocion,
    precioPromocion: values.esPromocion ? values.precioPromocion : undefined,
    imagenUrl: values.imagenUrl?.trim() || undefined,
    tiempoPreparacionMin: values.tiempoPreparacionMin,
    disponible: values.disponible,
    orden: values.orden,
  };
}

export function useActualizarProducto(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: EditarProductoFormValues }) =>
      actualizarProducto(id, toRequest(values)),
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
    isPending: mutation.isPending,
    fieldErrors: mutation.error instanceof ApiError ? mutation.error.fieldErrors : undefined,
    reset: mutation.reset,
  };
}
