import type {
  Pago,
  RegistrarPagoRequest,
  ResumenPagoPedido,
} from "@/features/pagos/types/pago.types";
import { apiClient } from "@/lib/api-client";

export async function obtenerResumenPagoPedido(pedidoId: number): Promise<ResumenPagoPedido> {
  const response = await apiClient.get<ResumenPagoPedido>(`/pagos/pedido/${pedidoId}`);
  if (!response.data) {
    throw new Error("Respuesta de resumen de pago sin datos");
  }
  return response.data;
}

export async function registrarPago(body: RegistrarPagoRequest): Promise<Pago> {
  const response = await apiClient.post<Pago>("/pagos", body);
  if (!response.data) {
    throw new Error("Respuesta de pago sin datos");
  }
  return response.data;
}
