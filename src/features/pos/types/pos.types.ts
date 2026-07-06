import type { Producto } from "@/features/productos/types/producto.types";

export interface CarritoItem {
  producto: Producto;
  cantidad: number;
  notas?: string;
}

export interface CategoriaPos {
  id: number;
  nombre: string;
  orden: number;
  ordenPadre: number;
}
