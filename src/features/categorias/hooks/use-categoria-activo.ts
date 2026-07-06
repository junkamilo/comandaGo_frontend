"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  actualizarActivoCategoria,
  eliminarCategoria,
} from "@/features/categorias/api/categorias.api";
import { ApiError } from "@/lib/api-error";

export function useCategoriaActivo(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const desactivar = useMutation({
    mutationFn: (id: number) => eliminarCategoria(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      queryClient.invalidateQueries({ queryKey: ["categorias", "menu"] });
      toast.success("Categoría desactivada");
      onSuccess?.();
    },
    onError: (error: Error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    },
  });

  const toggleActivo = useMutation({
    mutationFn: ({ id, activo }: { id: number; activo: boolean }) =>
      actualizarActivoCategoria(id, activo),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      queryClient.invalidateQueries({ queryKey: ["categorias", "menu"] });
      toast.success(data.activo ? "Categoría activada" : "Categoría desactivada");
      onSuccess?.();
    },
    onError: (error: Error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    },
  });

  return {
    desactivarCategoria: desactivar.mutate,
    toggleActivo: toggleActivo.mutate,
    isDesactivando: desactivar.isPending,
    isTogglingActivo: toggleActivo.isPending,
  };
}
