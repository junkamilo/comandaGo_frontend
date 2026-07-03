import { ScrollArea } from "@/components/ui/scroll-area";
import type { CategoriaPos } from "@/features/pos/types/pos.types";
import { cn } from "@/lib/utils";

interface CategorySidebarProps {
  categorias: CategoriaPos[];
  categoriaActiva: number | null;
  onSelect: (id: number) => void;
}

export function CategorySidebar({ categorias, categoriaActiva, onSelect }: CategorySidebarProps) {
  return (
    <aside className="hidden w-52 shrink-0 flex-col border-r border-border/60 bg-card/30 md:flex lg:w-56">
      <div className="p-3">
        <p className="px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Categorías
        </p>
      </div>
      <ScrollArea className="flex-1 px-2 pb-4">
        {categorias.length === 0 ? (
          <p className="px-2 py-4 text-sm text-muted-foreground">Sin categorías</p>
        ) : (
          <nav className="flex flex-col gap-1">
            {categorias.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelect(cat.id)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                  categoriaActiva === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {cat.nombre}
              </button>
            ))}
          </nav>
        )}
      </ScrollArea>
    </aside>
  );
}
