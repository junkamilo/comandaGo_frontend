import type { Categoria } from "@/features/categorias/types/categoria.types";
import type { CategoriaPos } from "@/features/pos/types/pos.types";

function sortByOrden(a: Categoria, b: Categoria) {
  return a.orden - b.orden || a.id - b.id;
}

export function flattenCategoriasPos(categorias: Categoria[]): CategoriaPos[] {
  const leaves: CategoriaPos[] = [];
  const sortedPadres = [...categorias].sort(sortByOrden);

  for (const padre of sortedPadres) {
    if (padre.subcategorias.length === 0) {
      leaves.push({
        id: padre.id,
        nombre: padre.nombre,
        orden: padre.orden,
        ordenPadre: 0,
      });
    } else {
      const hijas = [...padre.subcategorias].sort(sortByOrden);
      for (const hija of hijas) {
        leaves.push({
          id: hija.id,
          nombre: hija.nombre,
          orden: hija.orden,
          ordenPadre: padre.orden,
        });
      }
    }
  }

  return leaves.sort((a, b) => a.ordenPadre - b.ordenPadre || a.orden - b.orden || a.id - b.id);
}
