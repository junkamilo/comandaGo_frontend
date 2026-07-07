export type TipoPromocion = "PORCENTAJE" | "MONTO_FIJO" | "PRECIO_FIJO" | "PAGA_X_LLEVA_Y";

export interface ProductoPromo {
  id: number;
  nombre: string;
  precio: number;
  imagenUrl: string | null;
}

export interface Promocion {
  id: number;
  nombre: string;
  descripcion: string | null;
  tipo: TipoPromocion;
  valorPorcentaje: number | null;
  valorMonto: number | null;
  valorPrecio: number | null;
  pagaCantidad: number | null;
  llevaCantidad: number | null;
  fechaInicio: string;
  fechaFin: string | null;
  usoMaximo: number | null;
  usoActual: number;
  activo: boolean;
  vigente: boolean;
  productos: ProductoPromo[];
  fechaCreacion: string;
}

export interface PromocionRequest {
  nombre: string;
  descripcion?: string;
  tipo: TipoPromocion;
  valorPorcentaje?: number;
  valorMonto?: number;
  valorPrecio?: number;
  pagaCantidad?: number;
  llevaCantidad?: number;
  fechaInicio: string;
  fechaFin?: string;
  usoMaximo?: number;
  activo?: boolean;
  productoIds: number[];
}
