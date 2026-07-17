import type { DetallePedido, EstadoDetalle, ItemCocina, Pedido } from "@/features/pedidos/types/pedido.types";

export const IMPOCONSUMO = 0.08;

export function detallesActivos(pedido: Pedido): DetallePedido[] {
  return pedido.detalles.filter((d) => d.estado !== "CANCELADO");
}

export function todosActivosListos(pedido: Pedido): boolean {
  const activos = detallesActivos(pedido);
  return activos.length > 0 && activos.every((d) => d.estado === "LISTO");
}

export function todosActivosEntregados(pedido: Pedido): boolean {
  const activos = detallesActivos(pedido);
  return activos.length > 0 && activos.every((d) => d.estado === "ENTREGADO");
}

export function calcularTotales(subtotal: number) {
  const impuestos = Math.round(subtotal * IMPOCONSUMO * 100) / 100;
  return {
    subtotal,
    impuestos,
    total: Math.round((subtotal + impuestos) * 100) / 100,
  };
}

export function pedidosToItemsCocina(pedidos: Pedido[]): ItemCocina[] {
  const items: ItemCocina[] = [];
  for (const pedido of pedidos) {
    for (const detalle of pedido.detalles) {
      if (detalle.estado === "ENTREGADO" || detalle.estado === "CANCELADO") {
        continue;
      }
      items.push({
        pedidoId: pedido.id,
        detalleId: detalle.id,
        numeroPedido: pedido.numeroPedido,
        mesaNumero: pedido.mesaNumero,
        nombreProducto: detalle.nombreProducto,
        cantidad: detalle.cantidad,
        estado: detalle.estado,
        estadoPedido: pedido.estado,
        notasPreparacion: detalle.notasPreparacion,
        notasPedido: pedido.notas,
      });
    }
  }
  return items;
}

export type ColumnaCocina = "pendiente" | "preparando" | "listo";

export function columnaCocina(estado: EstadoDetalle): ColumnaCocina | null {
  switch (estado) {
    case "PENDIENTE":
      return "pendiente";
    case "EN_PREPARACION":
      return "preparando";
    case "LISTO":
      return "listo";
    default:
      return null;
  }
}

export function siguienteEstadoDetalle(estado: EstadoDetalle): EstadoDetalle | null {
  switch (estado) {
    case "PENDIENTE":
      return "EN_PREPARACION";
    case "EN_PREPARACION":
      return "LISTO";
    default:
      return null;
  }
}

export const estadoDetalleLabel: Record<EstadoDetalle, string> = {
  PENDIENTE: "Pendiente",
  EN_PREPARACION: "En preparación",
  LISTO: "Listo",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};
