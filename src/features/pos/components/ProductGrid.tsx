import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProductoCard } from "@/features/pos/components/ProductoCard";
import type { Producto } from "@/features/productos/types/producto.types";

interface ProductGridProps {
  busqueda: string;
  productosFiltrados: Producto[];
  onBusquedaChange: (value: string) => void;
  onAdd: (producto: Producto) => void;
}

export function ProductGrid({
  busqueda,
  productosFiltrados,
  onBusquedaChange,
  onAdd,
}: ProductGridProps) {
  return (
    <main className="flex min-h-0 min-w-0 flex-1 flex-col pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
      <div className="shrink-0 border-b border-border/60 p-3 md:p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1 p-3 md:p-4">
        {productosFiltrados.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-1 px-4 text-center text-muted-foreground">
            <p className="text-sm">No hay productos en esta categoría</p>
            <p className="text-xs">Prueba otra categoría o ajusta la búsqueda</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:gap-3 xl:grid-cols-3">
            {productosFiltrados.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} onAdd={onAdd} />
            ))}
          </div>
        )}
      </ScrollArea>
    </main>
  );
}
