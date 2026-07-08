"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { reemplazarDetallePedido } from "@/features/pedidos/api/pedidos.api";
import {
  invalidatePedidosQueries,
  PEDIDOS_QUERY_KEYS,
} from "@/features/pedidos/hooks/pedidos-query-keys";
import type { ReemplazarDetalleRequest } from "@/features/pedidos/types/pedido.types";
import { invalidateMesasQueries } from "@/features/mesas/hooks/mesas-query-keys";
import { ApiError } from "@/lib/api-error";

export function useReemplazarDetallePedido(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      pedidoId,
      detalleId,
      body,
    }: {
      pedidoId: number;
      detalleId: number;
      body: ReemplazarDetalleRequest;
    }) => reemplazarDetallePedido(pedidoId, detalleId, body),
    onSuccess: (data) => {
      invalidatePedidosQueries(queryClient);
      invalidateMesasQueries(queryClient);
      if (data.mesaId != null) {
        queryClient.invalidateQueries({ queryKey: PEDIDOS_QUERY_KEYS.porMesa(data.mesaId) });
      }
      toast.success("Producto reemplazado");
      onSuccess?.();
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && !error.fieldErrors?.length) {
        toast.error(error.message);
      }
    },
  });

  return {
    reemplazarDetallePedido: mutation.mutate,
    reemplazarDetallePedidoAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    reset: mutation.reset,
  };
}
