"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { reordenarProductos } from "@/features/productos/api/productos.api";
import { ApiError } from "@/lib/api-error";

export interface ReordenarProductosPayload {
  ids: number[];
  categoriaId: number;
}

export function useReordenarProductos() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: ReordenarProductosPayload) => reordenarProductos(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      queryClient.invalidateQueries({ queryKey: ["productos", "menu"] });
      toast.success("Orden actualizado");
    },
    onError: (error: Error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    },
  });

  return {
    reordenarProductos: mutation.mutate,
    reordenarProductosAsync: mutation.mutateAsync,
    isReordenando: mutation.isPending,
  };
}
