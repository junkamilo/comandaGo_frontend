export type EstadoMesa = "libre" | "ocupada" | "reservada";

export interface Categoria {
  id: string;
  nombre: string;
  icono: string;
}

export interface Producto {
  id: string;
  categoriaId: string;
  nombre: string;
  descripcion: string;
  precio: number;
  disponible: boolean;
  destacado?: boolean;
}

export interface Mesa {
  id: string;
  numero: string;
  estado: EstadoMesa;
}

export interface CarritoItem {
  producto: Producto;
  cantidad: number;
  notas?: string;
}
