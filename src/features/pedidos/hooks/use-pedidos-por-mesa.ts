"use client";

import { useQuery } from "@tanstack/react-query";

import { listarPedidosPorMesa } from "@/features/pedidos/api/pedidos.api";
import { PEDIDOS_QUERY_KEYS } from "@/features/pedidos/hooks/pedidos-query-keys";
import type { Pedido } from "@/features/pedidos/types/pedido.types";

export function usePedidosPorMesa(mesaId: number | null) {
  const query = useQuery({
    queryKey: mesaId != null ? PEDIDOS_QUERY_KEYS.porMesa(mesaId) : ["pedidos-mesa-empty"],
    queryFn: () => listarPedidosPorMesa(mesaId as number),
    enabled: mesaId != null,
    refetchInterval: 10_000,
  });

  const pedidos = query.data ?? [];
  const pedidoActivo: Pedido | null = (() => {
    if (pedidos.length === 0) {
      return null;
    }
    return (
      [...pedidos].sort((a, b) => Date.parse(b.fechaPedido) - Date.parse(a.fechaPedido))[0] ?? null
    );
  })();

  return {
    pedidos,
    pedidoActivo,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
  };
}
