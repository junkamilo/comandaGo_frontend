export type MetodoPago =
  | "EFECTIVO"
  | "TARJETA"
  | "TRANSFERENCIA"
  | "NEQUI"
  | "DAVIPLATA"
  | "PSE"
  | "OTRO";

export type EstadoTransaccionPago = "PENDIENTE" | "COMPLETADO" | "RECHAZADO" | "REEMBOLSADO";

export interface Pago {
  id: number;
  pedidoId: number;
  numeroPedido: string;
  cajeroNombre: string | null;
  metodo: MetodoPago;
  estado: EstadoTransaccionPago;
  monto: number;
  propina: number;
  montoRecibido: number | null;
  vuelto: number | null;
  referencia: string | null;
  proveedorId: string | null;
  notas: string | null;
  fechaPago: string;
}

export interface ResumenPagoPedido {
  pedidoId: number;
  numeroPedido: string;
  totalPedido: number;
  totalPagado: number;
  totalPropinas: number;
  saldoPendiente: number;
  estadoPago: string;
  pagos: Pago[];
}

export interface RegistrarPagoRequest {
  pedidoId: number;
  metodo: MetodoPago;
  monto: number;
  propina?: number;
  montoRecibido?: number;
  referencia?: string;
  proveedorId?: string;
  notas?: string;
}
