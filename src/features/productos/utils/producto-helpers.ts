import type { Categoria } from "@/features/categorias/types/categoria.types";

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
