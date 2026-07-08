import type { DetallePedido } from "@/features/pedidos/types/pedido.types";

export const estadoDetalleLabel: Record<DetallePedido["estado"], string> = {
  PENDIENTE: "Pendiente",
  EN_PREPARACION: "En preparación",
  LISTO: "Listo",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

export const estadoDetalleClass: Record<DetallePedido["estado"], string> = {
  PENDIENTE: "bg-secondary text-secondary-foreground",
  EN_PREPARACION: "bg-amber-500/20 text-amber-300",
  LISTO: "bg-emerald-500/20 text-emerald-300",
  ENTREGADO: "bg-primary/20 text-primary",
  CANCELADO: "bg-muted text-muted-foreground",
};

export function puedeCancelarDetalle(detalle: DetallePedido): boolean {
  return detalle.estado === "PENDIENTE";
}

export function puedeReemplazarDetalle(detalle: DetallePedido): boolean {
  return detalle.estado === "PENDIENTE";
}

export function puedeEntregarDetalle(detalle: DetallePedido): boolean {
  return detalle.estado === "LISTO";
}
