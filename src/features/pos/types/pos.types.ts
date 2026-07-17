import type { Producto } from "@/features/productos/types/producto.types";
import type { CambioInsumo } from "@/features/pos/types/personalizacion.types";

export interface CarritoItem {
  cartKey: string;
  producto: Producto;
  cantidad: number;
  /** Texto completo para UI (CAMBIO/SIN + nota libre). */
  notas?: string;
  /** Solo la nota libre del cliente; el backend la fusiona con CAMBIO/SIN. */
  notasCliente?: string;
  extrasIds?: number[];
  removidosIds?: number[];
  cambios?: CambioInsumo[];
  precioUnitario?: number;
}

export interface AgregarAlCarritoOptions {
  notas?: string;
  notasCliente?: string;
  extrasIds?: number[];
  removidosIds?: number[];
  cambios?: CambioInsumo[];
  precioUnitario?: number;
}

export interface CategoriaPos {
  id: number;
  nombre: string;
  orden: number;
  ordenPadre: number;
}

export function buildCartKey(productoId: number, notas?: string): string {
  return `${productoId}::${notas?.trim() ?? ""}`;
}

export function precioLineaUnitario(item: CarritoItem): number {
  return item.precioUnitario ?? item.producto.precioFinal;
}
