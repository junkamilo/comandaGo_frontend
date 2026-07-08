import type { EstadoPedido } from "@/features/pedidos/types/pedido.types";

export const estadoPedidoLabel: Record<EstadoPedido, string> = {
  POR_CONFIRMAR: "Por confirmar",
  EN_PREPARACION: "En preparación",
  LISTO: "Listo",
  EN_CAMINO: "En camino",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

export const estadoPedidoClass: Record<EstadoPedido, string> = {
  POR_CONFIRMAR: "bg-secondary text-secondary-foreground",
  EN_PREPARACION: "bg-amber-500/20 text-amber-300",
  LISTO: "bg-emerald-500/20 text-emerald-300",
  EN_CAMINO: "bg-blue-500/20 text-blue-300",
  ENTREGADO: "bg-primary/20 text-primary",
  CANCELADO: "bg-muted text-muted-foreground",
};
