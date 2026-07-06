export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  imagenUrl: string | null;
  orden: number;
  activo: boolean;
  categoriaPadreId: number | null;
  categoriaPadreNombre: string | null;
  subcategorias: Categoria[];
}

export interface CrearCategoriaRequest {
  nombre: string;
  descripcion?: string;
  imagenUrl?: string;
  categoriaPadreId?: number;
}

export interface ActualizarCategoriaRequest {
  nombre?: string;
  descripcion?: string;
  imagenUrl?: string;
  categoriaPadreId?: number;
}
