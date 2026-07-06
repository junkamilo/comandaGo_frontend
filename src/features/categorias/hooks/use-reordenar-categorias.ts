"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { reordenarCategorias } from "@/features/categorias/api/categorias.api";
import { ApiError } from "@/lib/api-error";

export interface ReordenarCategoriasPayload {
  ids: number[];
  categoriaPadreId?: number | null;
}

export function useReordenarCategorias() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: ReordenarCategoriasPayload) => reordenarCategorias(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      queryClient.invalidateQueries({ queryKey: ["categorias", "menu"] });
      toast.success("Orden actualizado");
    },
    onError: (error: Error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    },
  });

  return {
    reordenarCategorias: mutation.mutate,
    reordenarCategoriasAsync: mutation.mutateAsync,
    isReordenando: mutation.isPending,
  };
}
