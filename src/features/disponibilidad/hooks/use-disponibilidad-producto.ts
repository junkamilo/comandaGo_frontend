"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { actualizarDisponibilidadProducto } from "@/features/productos/api/productos.api";
import { ApiError } from "@/lib/api-error";

export function useDisponibilidadProducto() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, disponible }: { id: number; disponible: boolean }) =>
      actualizarDisponibilidadProducto(id, disponible),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["menu-del-dia"] });
      toast.success(data.disponible ? "Producto disponible" : "Producto marcado como agotado", {
        description: data.nombre,
      });
    },
    onError: (error: Error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    },
  });

  return {
    actualizarDisponibilidad: mutation.mutate,
    isPending: mutation.isPending,
    pendingId: mutation.isPending ? mutation.variables?.id : undefined,
  };
}
