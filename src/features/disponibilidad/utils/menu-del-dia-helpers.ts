import type { Producto } from "@/features/productos/types/producto.types";
import { formatProductoCategoriaRuta } from "@/features/productos/utils/producto-helpers";

export interface GrupoMenuDelDia {
  titulo: string;
  categoriaId: number;
  productos: Producto[];
}

export function agruparMenuDelDia(productos: Producto[]): GrupoMenuDelDia[] {
  const grupos = new Map<number, GrupoMenuDelDia>();

  for (const producto of productos) {
    if (producto.categoriaId == null) continue;

    const existente = grupos.get(producto.categoriaId);
    if (existente) {
      existente.productos.push(producto);
      continue;
    }

    grupos.set(producto.categoriaId, {
      titulo: formatProductoCategoriaRuta(producto.categoriaNombre, producto.categoriaPadreNombre),
      categoriaId: producto.categoriaId,
      productos: [producto],
    });
  }

  return Array.from(grupos.values());
}
