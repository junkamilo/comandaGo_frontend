"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { cancelarDetallesPedido } from "@/features/pedidos/api/pedidos.api";
import {
  invalidatePedidosQueries,
  PEDIDOS_QUERY_KEYS,
} from "@/features/pedidos/hooks/pedidos-query-keys";
import type { CancelarDetallesRequest } from "@/features/pedidos/types/pedido.types";
import { invalidateMesasQueries } from "@/features/mesas/hooks/mesas-query-keys";
import { ApiError } from "@/lib/api-error";

export function useCancelarDetallesPedido(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ pedidoId, body }: { pedidoId: number; body: CancelarDetallesRequest }) =>
      cancelarDetallesPedido(pedidoId, body),
    onSuccess: (data) => {
      invalidatePedidosQueries(queryClient);
      invalidateMesasQueries(queryClient);
      if (data.mesaId != null) {
        queryClient.invalidateQueries({ queryKey: PEDIDOS_QUERY_KEYS.porMesa(data.mesaId) });
      }
      toast.success("Ítems cancelados");
      onSuccess?.();
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && !error.fieldErrors?.length) {
        toast.error(error.message);
      }
    },
  });

  return {
    cancelarDetallesPedido: mutation.mutate,
    cancelarDetallesPedidoAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    reset: mutation.reset,
  };
}
