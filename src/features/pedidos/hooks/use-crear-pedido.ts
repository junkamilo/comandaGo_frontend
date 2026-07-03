"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { crearPedido } from "@/features/pedidos/api/pedidos.api";
import {
  invalidatePedidosQueries,
  PEDIDOS_QUERY_KEYS,
} from "@/features/pedidos/hooks/pedidos-query-keys";
import type { CrearPedidoRequest } from "@/features/pedidos/types/pedido.types";
import { invalidateMesasQueries } from "@/features/mesas/hooks/mesas-query-keys";
import { ApiError } from "@/lib/api-error";
import { formatCOP } from "@/lib/format-cop";

export function useCrearPedido(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (body: CrearPedidoRequest) => crearPedido(body),
    onSuccess: (data) => {
      invalidatePedidosQueries(queryClient);
      invalidateMesasQueries(queryClient);
      if (data.mesaId != null) {
        queryClient.invalidateQueries({
          queryKey: PEDIDOS_QUERY_KEYS.porMesa(data.mesaId),
        });
      }
      toast.success("Pedido enviado a cocina", {
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
    crearPedido: mutation.mutate,
    crearPedidoAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    fieldErrors: mutation.error instanceof ApiError ? mutation.error.fieldErrors : undefined,
    reset: mutation.reset,
  };
}
