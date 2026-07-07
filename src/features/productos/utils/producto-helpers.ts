import type { Categoria } from "@/features/categorias/types/categoria.types";
import type { Producto } from "@/features/productos/types/producto.types";

export function sortProductosByOrden(productos: Producto[]): Producto[] {
  return [...productos].sort((a, b) => a.orden - b.orden || a.id - b.id);
}

export function groupProductosPorCategoria(productos: Producto[]): Map<number, Producto[]> {
  const grouped = new Map<number, Producto[]>();

  for (const producto of productos) {
    const list = grouped.get(producto.categoriaId) ?? [];
    list.push(producto);
    grouped.set(producto.categoriaId, list);
  }

  for (const [categoriaId, list] of grouped) {
    grouped.set(categoriaId, sortProductosByOrden(list));
  }

  return grouped;
}

export function categoriaContainerId(categoriaId: number): string {
  return `categoria-${categoriaId}`;
}

export function sortCategoriaIdsPorOrden(
  categoriaIds: number[],
  categorias: Categoria[],
): number[] {
  const ordenPorId = new Map(categorias.map((c) => [c.id, c.orden]));

  return [...categoriaIds].sort(
    (a, b) => (ordenPorId.get(a) ?? 0) - (ordenPorId.get(b) ?? 0) || a - b,
  );
}

export function getCategoriasHoja(categorias: Categoria[]): Categoria[] {
  const idsWithChildren = new Set<number>();
  for (const categoria of categorias) {
    if (categoria.categoriaPadreId !== null) {
      idsWithChildren.add(categoria.categoriaPadreId);
    }
  }

  return categorias
    .filter((c) => c.activo && !idsWithChildren.has(c.id))
    .sort((a, b) => a.orden - b.orden || a.id - b.id);
}

export function formatCategoriaLabel(categoria: Categoria): string {
  if (categoria.categoriaPadreNombre) {
    return `${categoria.categoriaPadreNombre} › ${categoria.nombre}`;
  }
  return categoria.nombre;
}

export function formatProductoCategoriaRuta(
  categoriaNombre: string,
  categoriaPadreNombre: string | null,
): string {
  if (categoriaPadreNombre) {
    return `${categoriaPadreNombre} › ${categoriaNombre}`;
  }
  return categoriaNombre;
}
