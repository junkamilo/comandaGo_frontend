import type { PageResponse } from "@/lib/types/api-response";

export interface Producto {
  id: number;
  categoriaId: number;
  categoriaNombre: string;
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
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface CrearProductoRequest {
  categoriaId: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  precioPromocion?: number;
  imagenUrl?: string;
  tiempoPreparacionMin?: number;
  esPromocion?: boolean;
}

export interface ActualizarProductoRequest {
  categoriaId?: number;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  precioPromocion?: number;
  imagenUrl?: string;
  tiempoPreparacionMin?: number;
  esPromocion?: boolean;
  disponible?: boolean;
}

export interface ListarProductosParams {
  categoriaId?: number;
  activo?: boolean;
  disponible?: boolean;
  esPromocion?: boolean;
  page?: number;
  size?: number;
}

export type ProductosPage = PageResponse<Producto>;
