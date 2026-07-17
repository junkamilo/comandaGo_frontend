import type { Receta } from "@/features/recetas/types/receta.types";
import type { PageResponse } from "@/lib/types/api-response";

export type TipoProducto = "NORMAL" | "COMPUESTO" | "INSUMO";

export type UnidadInsumo = "UND" | "GR" | "ML" | "KG" | "LT" | "PORCION";

export interface ProductoInsumo {
  id?: number;
  productoInsumoId: number;
  nombre?: string;
  cantidad: number;
  unidad: UnidadInsumo;
  esRemovible: boolean;
  esExtra: boolean;
  precioExtra: number | null;
  orden: number;
}

export interface Producto {
  id: number;
  categoriaId: number | null;
  categoriaNombre: string | null;
  categoriaPadreNombre: string | null;
  nombre: string;
  descripcion: string | null;
  precio: number;
  precioPromocion: number | null;
  precioFinal: number;
  imagenUrl: string | null;
  tiempoPreparacionMin: number | null;
  esPromocion: boolean;
  disponible: boolean;
  activo: boolean;
  orden: number;
  tipo: TipoProducto;
  composicion?: ProductoInsumo[];
  recetaId?: number | null;
  recetaNombre?: string | null;
  receta?: Receta | null;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface ProductoInsumoRequest {
  productoInsumoId: number;
  cantidad?: number;
  unidad?: UnidadInsumo;
  esRemovible?: boolean;
  esExtra?: boolean;
  precioExtra?: number | null;
  orden?: number;
}

export interface CrearProductoRequest {
  categoriaId?: number | null;
  nombre: string;
  descripcion?: string;
  precio: number;
  precioPromocion?: number;
  imagenUrl?: string;
  esPromocion?: boolean;
  tipo?: TipoProducto;
  composicion?: ProductoInsumoRequest[];
  recetaId?: number | null;
}

export interface ActualizarProductoRequest {
  categoriaId?: number | null;
  sinCategoria?: boolean;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  precioPromocion?: number;
  imagenUrl?: string;
  esPromocion?: boolean;
  disponible?: boolean;
  tipo?: TipoProducto;
  composicion?: ProductoInsumoRequest[];
  recetaId?: number | null;
}

export interface ListarProductosParams {
  categoriaId?: number;
  activo?: boolean;
  disponible?: boolean;
  esPromocion?: boolean;
  tipo?: TipoProducto;
  page?: number;
  size?: number;
}

export type ProductosPage = PageResponse<Producto>;
