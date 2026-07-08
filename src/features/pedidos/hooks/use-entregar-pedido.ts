"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  entregarDetallePedido,
  entregarPedidoCompleto,
} from "@/features/pedidos/api/pedidos.api";
import {
  invalidatePedidosQueries,
  PEDIDOS_QUERY_KEYS,
} from "@/features/pedidos/hooks/pedidos-query-keys";
import { invalidateMesasQueries } from "@/features/mesas/hooks/mesas-query-keys";
import { ApiError } from "@/lib/api-error";

export function useEntregarPedido() {
  const queryClient = useQueryClient();

  const entregarDetalle = useMutation({
    mutationFn: ({
      pedidoId,
      detalleId,
    }: {
      pedidoId: number;
      detalleId: number;
      mesaId?: number | null;
    }) => entregarDetallePedido(pedidoId, detalleId),
    onSuccess: (_data, variables) => {
      invalidatePedidosQueries(queryClient);
      invalidateMesasQueries(queryClient);
      if (variables.mesaId != null) {
        queryClient.invalidateQueries({ queryKey: PEDIDOS_QUERY_KEYS.porMesa(variables.mesaId) });
      }
      toast.success("Plato marcado como entregado");
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && !error.fieldErrors?.length) {
        toast.error(error.message);
      }
    },
  });

  const entregarCompleto = useMutation({
    mutationFn: (pedidoId: number) => entregarPedidoCompleto(pedidoId),
    onSuccess: (data) => {
      invalidatePedidosQueries(queryClient);
      invalidateMesasQueries(queryClient);
      if (data.mesaId != null) {
        queryClient.invalidateQueries({ queryKey: PEDIDOS_QUERY_KEYS.porMesa(data.mesaId) });
      }
      toast.success("Pedido entregado");
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && !error.fieldErrors?.length) {
        toast.error(error.message);
      }
    },
  });

  return {
    entregarDetalleAsync: entregarDetalle.mutateAsync,
    entregarCompletoAsync: entregarCompleto.mutateAsync,
    isPending: entregarDetalle.isPending || entregarCompleto.isPending,
  };
}
