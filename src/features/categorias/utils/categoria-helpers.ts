import type { Categoria } from "@/features/categorias/types/categoria.types";

export function getCategoriasPrincipalesActivas(
  categorias: Categoria[],
  excludeId?: number,
): Categoria[] {
  return categorias.filter((c) => c.categoriaPadreId === null && c.activo && c.id !== excludeId);
}

export function tieneHijasActivas(categorias: Categoria[], id: number): boolean {
  return categorias.some((c) => c.categoriaPadreId === id && c.activo);
}

export function buildCategoriasJerarquia(
  categorias: Categoria[],
): { categoria: Categoria; isChild: boolean }[] {
  const sorted = [...categorias].sort((a, b) => a.orden - b.orden || a.id - b.id);
  const result: { categoria: Categoria; isChild: boolean }[] = [];
  const shown = new Set<number>();

  for (const padre of sorted.filter((c) => c.categoriaPadreId === null)) {
    result.push({ categoria: padre, isChild: false });
    shown.add(padre.id);
    for (const hija of sorted.filter((c) => c.categoriaPadreId === padre.id)) {
      result.push({ categoria: hija, isChild: true });
      shown.add(hija.id);
    }
  }

  for (const c of sorted) {
    if (!shown.has(c.id)) {
      result.push({ categoria: c, isChild: c.categoriaPadreId !== null });
    }
  }

  return result;
}
