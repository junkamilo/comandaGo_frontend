export type OrigenPedido = "MESA_MESERO" | "MESA_QR" | "WEB_DOMICILIO";

export type EstadoPedido =
  "POR_CONFIRMAR" | "EN_PREPARACION" | "LISTO" | "EN_CAMINO" | "ENTREGADO" | "CANCELADO";

export type EstadoPago = "PENDIENTE" | "PARCIAL" | "PAGADO" | "REEMBOLSADO";

export type EstadoDetalle = "PENDIENTE" | "EN_PREPARACION" | "LISTO" | "ENTREGADO" | "CANCELADO";

export interface DetallePedido {
  id: number;
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  estado: EstadoDetalle;
  notasPreparacion: string | null;
}

export interface Pedido {
  id: number;
  numeroPedido: string;
  usuarioId: number | null;
  meseroNombre: string | null;
  mesaId: number | null;
  mesaNumero: string | null;
  origen: OrigenPedido;
  estado: EstadoPedido;
  estadoPago: EstadoPago;
  clienteNombre: string | null;
  clienteTelefono: string | null;
  direccionEntrega: string | null;
  subtotal: number;
  descuento: number;
  impuestos: number;
  costoEnvio: number;
  total: number;
  notas: string | null;
  fechaPedido: string;
  fechaActualizacion: string;
  detalles: DetallePedido[];
}

export interface DetallePedidoItemRequest {
  productoId: number;
  cantidad: number;
  notasPreparacion?: string;
}

export interface CrearPedidoRequest {
  origen: OrigenPedido;
  mesaId?: number;
  clienteNombre?: string;
  clienteTelefono?: string;
  direccionEntrega?: string;
  notas?: string;
  detalles: DetallePedidoItemRequest[];
}

export interface PedidoEstadoRequest {
  estado: EstadoPedido;
}

export interface DetalleEstadoRequest {
  estado: EstadoDetalle;
}

export interface CancelarDetallesRequest {
  detalleIds: number[];
}

export interface AgregarDetallesRequest {
  detalles: DetallePedidoItemRequest[];
}

export interface ReemplazarDetalleRequest {
  nuevoProductoId: number;
  cantidad: number;
  notasPreparacion?: string;
}

export interface ItemCocina {
  pedidoId: number;
  detalleId: number;
  numeroPedido: string;
  mesaNumero: string | null;
  nombreProducto: string;
  cantidad: number;
  estado: EstadoDetalle;
  estadoPedido: EstadoPedido;
}
