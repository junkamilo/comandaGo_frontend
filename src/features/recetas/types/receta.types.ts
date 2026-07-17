export type UnidadInsumo = "UND" | "GR" | "ML" | "KG" | "LT" | "PORCION";

export interface Ingrediente {
  id?: number;
  productoId: number;
  productoNombre?: string;
  productoImagenUrl?: string | null;
  categoriaId: number | null;
  categoriaNombre: string | null;
  cantidad: number;
  unidad: UnidadInsumo;
  esRemovible: boolean;
  orden: number;
}

export interface Receta {
  id: number;
  nombre: string;
  descripcion: string | null;
  preparacion: string | null;
  tiempoTotalMin: number | null;
  porciones: number | null;
  activo: boolean;
  ingredientes: Ingrediente[];
  ingredientesPorCategoria: Record<string, Ingrediente[]>;
  totalIngredientes: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface IngredienteRequest {
  productoId: number;
  cantidad?: number;
  unidad?: UnidadInsumo;
  esRemovible?: boolean;
  orden?: number;
}

export interface RecetaRequest {
  nombre: string;
  descripcion?: string;
  preparacion?: string;
  tiempoTotalMin?: number | null;
  porciones?: number | null;
  activo?: boolean;
  ingredientes: IngredienteRequest[];
}
