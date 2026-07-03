"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { actualizarActivo, desactivarUsuario } from "@/features/personal/api/usuarios.api";
import { ApiError } from "@/lib/api-error";

export function useDesactivarUsuario(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const desactivar = useMutation({
    mutationFn: (id: number) => desactivarUsuario(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast.success("Usuario desactivado");
      onSuccess?.();
    },
    onError: (error: Error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    },
  });

  const toggleActivo = useMutation({
    mutationFn: ({ id, activo }: { id: number; activo: boolean }) => actualizarActivo(id, activo),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast.success(data.activo ? "Usuario activado" : "Usuario desactivado");
      onSuccess?.();
    },
    onError: (error: Error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    },
  });

  return {
    desactivarUsuario: desactivar.mutate,
    toggleActivo: toggleActivo.mutate,
    isDesactivando: desactivar.isPending,
    isTogglingActivo: toggleActivo.isPending,
  };
}
