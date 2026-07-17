import type {
  AgregarDetallesRequest,
  CancelarDetallesRequest,
  CrearPedidoRequest,
  DetalleEstadoRequest,
  Pedido,
  PedidoEstadoRequest,
  ReemplazarDetalleRequest,
} from "@/features/pedidos/types/pedido.types";
import { apiClient } from "@/lib/api-client";

export async function crearPedido(body: CrearPedidoRequest): Promise<Pedido> {
  const response = await apiClient.post<Pedido>("/pedidos", body);
  if (!response.data) {
    throw new Error("Respuesta de creación sin datos");
  }
  return response.data;
}

export async function actualizarPedido(
  id: number,
  body: { notas?: string },
): Promise<Pedido> {
  const response = await apiClient.put<Pedido>(`/pedidos/${id}`, body);
  if (!response.data) {
    throw new Error("Respuesta de actualización sin datos");
  }
  return response.data;
}

export async function listarPedidosCocina(): Promise<Pedido[]> {
  const response = await apiClient.get<Pedido[]>("/pedidos/cocina");
  if (!response.data) {
    throw new Error("Respuesta de cocina sin datos");
  }
  return response.data;
}

export async function listarPedidosActivos(): Promise<Pedido[]> {
  const response = await apiClient.get<Pedido[]>("/pedidos/activos");
  if (!response.data) {
    throw new Error("Respuesta de activos sin datos");
  }
  return response.data;
}

export async function listarPedidosPorMesa(mesaId: number): Promise<Pedido[]> {
  const response = await apiClient.get<Pedido[]>(`/pedidos/mesa/${mesaId}`);
  if (!response.data) {
    throw new Error("Respuesta de mesa sin datos");
  }
  return response.data;
}

export async function obtenerPedido(id: number): Promise<Pedido> {
  const response = await apiClient.get<Pedido>(`/pedidos/${id}`);
  if (!response.data) {
    throw new Error("Respuesta de pedido sin datos");
  }
  return response.data;
}

export async function actualizarEstadoPedido(
  id: number,
  body: PedidoEstadoRequest,
): Promise<Pedido> {
  const response = await apiClient.patch<Pedido>(`/pedidos/${id}/estado`, body);
  if (!response.data) {
    throw new Error("Respuesta de estado sin datos");
  }
  return response.data;
}

export async function cancelarPedido(id: number): Promise<Pedido> {
  const response = await apiClient.patch<Pedido>(`/pedidos/${id}/cancelar`);
  if (!response.data) {
    throw new Error("Respuesta de cancelación sin datos");
  }
  return response.data;
}

export async function actualizarEstadoDetalle(
  pedidoId: number,
  detalleId: number,
  body: DetalleEstadoRequest,
): Promise<unknown> {
  const response = await apiClient.patch(`/pedidos/${pedidoId}/detalles/${detalleId}/estado`, body);
  return response.data;
}

export async function agregarDetallesPedido(
  pedidoId: number,
  body: AgregarDetallesRequest,
): Promise<Pedido> {
  const response = await apiClient.post<Pedido>(`/pedidos/${pedidoId}/detalles/lote`, body);
  if (!response.data) {
    throw new Error("Respuesta de agregar detalles sin datos");
  }
  return response.data;
}

export async function cancelarDetallesPedido(
  pedidoId: number,
  body: CancelarDetallesRequest,
): Promise<Pedido> {
  const response = await apiClient.patch<Pedido>(`/pedidos/${pedidoId}/cancelar-detalles`, body);
  if (!response.data) {
    throw new Error("Respuesta de cancelar detalles sin datos");
  }
  return response.data;
}

export async function reemplazarDetallePedido(
  pedidoId: number,
  detalleId: number,
  body: ReemplazarDetalleRequest,
): Promise<Pedido> {
  const response = await apiClient.put<Pedido>(
    `/pedidos/${pedidoId}/detalles/${detalleId}/reemplazar`,
    body,
  );
  if (!response.data) {
    throw new Error("Respuesta de reemplazar detalle sin datos");
  }
  return response.data;
}

export async function entregarDetallePedido(
  pedidoId: number,
  detalleId: number,
): Promise<unknown> {
  const response = await apiClient.patch(`/pedidos/${pedidoId}/detalles/${detalleId}/entregar`);
  return response.data;
}

export async function entregarPedidoCompleto(pedidoId: number): Promise<Pedido> {
  const response = await apiClient.patch<Pedido>(`/pedidos/${pedidoId}/entregar`);
  if (!response.data) {
    throw new Error("Respuesta de entrega sin datos");
  }
  return response.data;
}
