import type { EstadoPago } from "@/features/pedidos/types/pedido.types";

export const estadoPagoPedidoLabel: Record<EstadoPago, string> = {
  PENDIENTE: "Pendiente de pago",
  PARCIAL: "Pago parcial",
  PAGADO: "Pagado",
  REEMBOLSADO: "Reembolsado",
};

export const estadoPagoPedidoClass: Record<EstadoPago, string> = {
  PENDIENTE: "bg-amber-500/20 text-amber-300",
  PARCIAL: "bg-blue-500/20 text-blue-300",
  PAGADO: "bg-emerald-500/20 text-emerald-300",
  REEMBOLSADO: "bg-muted text-muted-foreground",
};
