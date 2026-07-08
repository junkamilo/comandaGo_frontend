"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { registrarPago } from "@/features/pagos/api/pagos.api";
import { PAGOS_QUERY_KEYS } from "@/features/pagos/hooks/pagos-query-keys";
import type { RegistrarPagoRequest } from "@/features/pagos/types/pago.types";
import { invalidatePedidosQueries, PEDIDOS_QUERY_KEYS } from "@/features/pedidos/hooks/pedidos-query-keys";
import { invalidateMesasQueries } from "@/features/mesas/hooks/mesas-query-keys";
import { ApiError } from "@/lib/api-error";
import { formatCOP } from "@/lib/format-cop";

interface RegistrarPagoParams {
  body: RegistrarPagoRequest;
  mesaId?: number | null;
}

export function useRegistrarPago(onPagado?: () => void) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ body }: RegistrarPagoParams) => registrarPago(body),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: PAGOS_QUERY_KEYS.resumen(variables.body.pedidoId),
      });
      invalidatePedidosQueries(queryClient);
      invalidateMesasQueries(queryClient);
      if (variables.mesaId != null) {
        queryClient.invalidateQueries({ queryKey: PEDIDOS_QUERY_KEYS.porMesa(variables.mesaId) });
      }
      const vueltoMsg =
        data.vuelto != null && data.vuelto > 0 ? ` · Vuelto: ${formatCOP(data.vuelto)}` : "";
      toast.success("Pago registrado", {
        description: `${formatCOP(data.monto)}${vueltoMsg}`,
      });
      onPagado?.();
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && !error.fieldErrors?.length) {
        toast.error(error.message);
      }
    },
  });

  return {
    registrarPagoAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}
