"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { actualizarEstadoMesa } from "@/features/mesas/api/mesas.api";
import { invalidateMesasQueries } from "@/features/mesas/hooks/mesas-query-keys";
import type { EstadoMesa } from "@/features/mesas/types/mesa.types";
import { estadoMesaLabel } from "@/features/mesas/utils/estado-mesa";
import { ApiError } from "@/lib/api-error";

export function useActualizarEstadoMesa(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: EstadoMesa }) =>
      actualizarEstadoMesa(id, estado),
    onSuccess: (data) => {
      invalidateMesasQueries(queryClient);
      toast.success(`Mesa ${data.numero} → ${estadoMesaLabel[data.estado]}`);
      onSuccess?.();
    },
    onError: (error: Error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    },
  });

  return {
    actualizarEstado: mutation.mutate,
    isActualizando: mutation.isPending,
  };
}
