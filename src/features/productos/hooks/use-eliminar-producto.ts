"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { eliminarProducto } from "@/features/productos/api/productos.api";
import { ApiError } from "@/lib/api-error";

export function useEliminarProducto(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => eliminarProducto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      toast.success("Producto eliminado del menú");
      onSuccess?.();
    },
    onError: (error: Error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    },
  });

  return {
    eliminarProducto: mutation.mutate,
    isPending: mutation.isPending,
  };
}
