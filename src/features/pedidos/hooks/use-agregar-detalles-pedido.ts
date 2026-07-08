"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { agregarDetallesPedido } from "@/features/pedidos/api/pedidos.api";
import {
  invalidatePedidosQueries,
  PEDIDOS_QUERY_KEYS,
} from "@/features/pedidos/hooks/pedidos-query-keys";
import type { AgregarDetallesRequest } from "@/features/pedidos/types/pedido.types";
import { invalidateMesasQueries } from "@/features/mesas/hooks/mesas-query-keys";
import { ApiError } from "@/lib/api-error";
import { formatCOP } from "@/lib/format-cop";

export function useAgregarDetallesPedido(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ pedidoId, body }: { pedidoId: number; body: AgregarDetallesRequest }) =>
      agregarDetallesPedido(pedidoId, body),
    onSuccess: (data) => {
      invalidatePedidosQueries(queryClient);
      invalidateMesasQueries(queryClient);
      if (data.mesaId != null) {
        queryClient.invalidateQueries({ queryKey: PEDIDOS_QUERY_KEYS.porMesa(data.mesaId) });
      }
      toast.success("Detalles agregados al pedido", {
        description: `${data.numeroPedido} · ${formatCOP(data.total)}`,
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && !error.fieldErrors?.length) {
        toast.error(error.message);
      }
    },
  });

  return {
    agregarDetallesPedido: mutation.mutate,
    agregarDetallesPedidoAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    reset: mutation.reset,
  };
}
