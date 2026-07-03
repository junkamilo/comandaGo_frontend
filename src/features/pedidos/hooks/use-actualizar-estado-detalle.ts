"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  actualizarEstadoDetalle,
  actualizarEstadoPedido,
} from "@/features/pedidos/api/pedidos.api";
import { invalidatePedidosQueries } from "@/features/pedidos/hooks/pedidos-query-keys";
import type { EstadoDetalle, EstadoPedido } from "@/features/pedidos/types/pedido.types";
import { ApiError } from "@/lib/api-error";

interface ActualizarDetalleParams {
  pedidoId: number;
  detalleId: number;
  estado: EstadoDetalle;
  estadoPedido?: EstadoPedido;
}

export function useActualizarEstadoDetalle() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ pedidoId, detalleId, estado, estadoPedido }: ActualizarDetalleParams) => {
      if (estado === "EN_PREPARACION" && estadoPedido === "POR_CONFIRMAR") {
        await actualizarEstadoPedido(pedidoId, { estado: "EN_PREPARACION" });
      }
      await actualizarEstadoDetalle(pedidoId, detalleId, { estado });
    },
    onSuccess: () => {
      invalidatePedidosQueries(queryClient);
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && !error.fieldErrors?.length) {
        toast.error(error.message);
      }
    },
  });

  return {
    actualizarEstadoDetalle: mutation.mutate,
    isPending: mutation.isPending,
  };
}
