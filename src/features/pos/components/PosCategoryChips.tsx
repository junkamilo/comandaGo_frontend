import type { CategoriaPos } from "@/features/pos/types/pos.types";
import { cn } from "@/lib/utils";

interface PosCategoryChipsProps {
  categorias: CategoriaPos[];
  categoriaActiva: number | null;
  onSelect: (id: number) => void;
}

export function PosCategoryChips({ categorias, categoriaActiva, onSelect }: PosCategoryChipsProps) {
  if (categorias.length === 0) return null;

  return (
    <div className="shrink-0 border-b border-border/60 px-3 py-2 md:hidden">
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categorias.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              categoriaActiva === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            {cat.nombre}
          </button>
        ))}
      </div>
    </div>
  );
}
