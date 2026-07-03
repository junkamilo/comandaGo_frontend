import type { Categoria } from "@/features/categorias/types/categoria.types";
import type { CategoriaPos } from "@/features/pos/types/pos.types";

export function flattenCategoriasPos(categorias: Categoria[]): CategoriaPos[] {
  const leaves: CategoriaPos[] = [];

  function walk(list: Categoria[]) {
    for (const categoria of list) {
      if (categoria.subcategorias.length === 0) {
        leaves.push({ id: categoria.id, nombre: categoria.nombre });
      } else {
        walk(categoria.subcategorias);
      }
    }
  }

  walk(categorias);
  return leaves.sort((a, b) => a.nombre.localeCompare(b.nombre));
}
