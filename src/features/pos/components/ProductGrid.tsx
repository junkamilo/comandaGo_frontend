import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductoCard } from "@/features/pos/components/ProductoCard";
import { CATEGORIAS } from "@/features/pos/data/mock-data";
import type { Producto } from "@/features/pos/types/pos.types";

interface ProductGridProps {
  categoriaActiva: string;
  busqueda: string;
  productosFiltrados: Producto[];
  onCategoriaChange: (id: string) => void;
  onBusquedaChange: (value: string) => void;
  onAdd: (producto: Producto) => void;
}

export function ProductGrid({
  categoriaActiva,
  busqueda,
  productosFiltrados,
  onCategoriaChange,
  onBusquedaChange,
  onAdd,
}: ProductGridProps) {
  return (
    <main className="flex min-w-0 flex-1 flex-col">
      <div className="border-b border-border/60 p-3 md:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => onBusquedaChange(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={categoriaActiva} onValueChange={onCategoriaChange}>
            <SelectTrigger className="w-full sm:w-48 md:hidden">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIAS.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.icono} {cat.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="flex-1 p-3 md:p-4">
        {productosFiltrados.length === 0 ? (
          <div className="flex h-48 items-center justify-center text-muted-foreground">
            No hay productos en esta categoría
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {productosFiltrados.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} onAdd={onAdd} />
            ))}
          </div>
        )}
      </ScrollArea>
    </main>
  );
}
