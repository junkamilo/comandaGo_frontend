export interface AlternativaInsumo {
  productoId: number;
  nombre: string;
}

export interface IngredientePersonalizacion {
  productoId: number;
  nombre: string;
  categoriaId: number | null;
  categoriaNombre: string | null;
  esRemovible: boolean;
  orden: number;
  alternativas: AlternativaInsumo[];
}

export interface PersonalizacionProducto {
  productoId: number;
  nombre: string;
  precioBase: number;
  ingredientes: IngredientePersonalizacion[];
}

export interface CambioInsumo {
  desdeProductoId: number;
  haciaProductoId: number;
}

export interface CambioAplicado {
  desdeProductoId: number;
  desdeNombre: string;
  haciaProductoId: number;
  haciaNombre: string;
}
