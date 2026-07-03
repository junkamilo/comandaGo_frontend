"use client";

import { useQuery } from "@tanstack/react-query";

import { listarPedidosCocina } from "@/features/pedidos/api/pedidos.api";
import { PEDIDOS_QUERY_KEYS } from "@/features/pedidos/hooks/pedidos-query-keys";
import { pedidosToItemsCocina } from "@/features/pedidos/utils/pedido-helpers";

export function usePedidosCocina() {
  const query = useQuery({
    queryKey: PEDIDOS_QUERY_KEYS.cocina,
    queryFn: listarPedidosCocina,
    refetchInterval: 15_000,
  });

  const pedidos = query.data ?? [];
  const items = pedidosToItemsCocina(pedidos);

  return {
    pedidos,
    items,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
