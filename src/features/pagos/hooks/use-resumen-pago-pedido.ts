"use client";

import { useQuery } from "@tanstack/react-query";

import { obtenerResumenPagoPedido } from "@/features/pagos/api/pagos.api";
import { PAGOS_QUERY_KEYS } from "@/features/pagos/hooks/pagos-query-keys";

export function useResumenPagoPedido(pedidoId: number | null, enabled = true) {
  return useQuery({
    queryKey: pedidoId != null ? PAGOS_QUERY_KEYS.resumen(pedidoId) : ["pagos-resumen-empty"],
    queryFn: () => obtenerResumenPagoPedido(pedidoId as number),
    enabled: pedidoId != null && enabled,
  });
}
