import type { ProductoInsumo } from "@/features/productos/types/producto.types";
import type { Ingrediente } from "@/features/recetas/types/receta.types";
import type {
  AlternativaInsumo,
  CambioAplicado,
  IngredientePersonalizacion,
} from "@/features/pos/types/personalizacion.types";
import { formatCOP } from "@/lib/format-cop";

/** Línea unificada para personalización POS (receta o composición legacy). */
export interface PersonalizacionLinea {
  productoId: number;
  nombre: string;
  esRemovible: boolean;
  esExtra: boolean;
  precioExtra: number | null;
  categoriaId: number | null;
  categoriaNombre: string | null;
  alternativas: AlternativaInsumo[];
}

export function fromIngredientePersonalizacion(
  ing: IngredientePersonalizacion,
): PersonalizacionLinea {
  return {
    productoId: ing.productoId,
    nombre: ing.nombre,
    esRemovible: Boolean(ing.esRemovible),
    esExtra: false,
    precioExtra: null,
    categoriaId: ing.categoriaId,
    categoriaNombre: ing.categoriaNombre,
    alternativas: ing.alternativas ?? [],
  };
}

export function fromIngrediente(ing: Ingrediente): PersonalizacionLinea {
  return {
    productoId: ing.productoId,
    nombre: ing.productoNombre ?? `Insumo ${ing.productoId}`,
    esRemovible: Boolean(ing.esRemovible),
    esExtra: false,
    precioExtra: null,
    categoriaId: ing.categoriaId,
    categoriaNombre: ing.categoriaNombre,
    alternativas: [],
  };
}

export function fromProductoInsumo(pi: ProductoInsumo): PersonalizacionLinea {
  return {
    productoId: pi.productoInsumoId,
    nombre: pi.nombre ?? `Insumo ${pi.productoInsumoId}`,
    esRemovible: Boolean(pi.esRemovible),
    esExtra: Boolean(pi.esExtra),
    precioExtra: pi.precioExtra != null ? Number(pi.precioExtra) : null,
    categoriaId: null,
    categoriaNombre: null,
    alternativas: [],
  };
}

export function buildNotasPreparacion(
  removidos: PersonalizacionLinea[],
  extras: PersonalizacionLinea[] = [],
  cambios: CambioAplicado[] = [],
  notaLibre?: string,
): string | undefined {
  const partes: string[] = [];

  if (cambios.length > 0) {
    partes.push(
      `CAMBIO: ${cambios.map((c) => `${c.desdeNombre} → ${c.haciaNombre}`).join(", ")}`,
    );
  }

  if (removidos.length > 0) {
    partes.push(`SIN: ${removidos.map((r) => r.nombre).join(", ")}`);
  }

  if (extras.length > 0) {
    partes.push(
      `EXTRA: ${extras
        .map((e) => {
          const precio = e.precioExtra != null ? formatCOP(Number(e.precioExtra)) : "";
          return precio ? `${e.nombre} (+${precio})` : e.nombre;
        })
        .join(", ")}`,
    );
  }

  const libre = notaLibre?.trim();
  if (libre) {
    partes.push(libre);
  }

  return partes.length > 0 ? partes.join(" | ") : undefined;
}

export function sumPrecioExtras(extras: PersonalizacionLinea[]): number {
  return extras.reduce((sum, e) => sum + Number(e.precioExtra ?? 0), 0);
}

export function groupPersonalizacion(
  lineas: PersonalizacionLinea[],
): { categoria: string; items: PersonalizacionLinea[] }[] {
  const map = new Map<string, PersonalizacionLinea[]>();
  for (const linea of lineas) {
    const key = linea.categoriaNombre?.trim() || "Sin categoría";
    const list = map.get(key) ?? [];
    list.push(linea);
    map.set(key, list);
  }
  return [...map.entries()].map(([categoria, items]) => ({ categoria, items }));
}
