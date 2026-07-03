import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Producto } from "@/features/productos/types/producto.types";
import { formatCOP } from "@/lib/format-cop";
import { cn } from "@/lib/utils";

interface ProductoCardProps {
  producto: Producto;
  onAdd: (producto: Producto) => void;
}

export function ProductoCard({ producto, onAdd }: ProductoCardProps) {
  return (
    <Card
      className={cn(
        "group min-h-11 cursor-pointer border-border/60 bg-card/80 transition-all hover:border-primary/40 hover:shadow-md active:scale-[0.98]",
        !producto.disponible && "opacity-50",
      )}
      onClick={() => producto.disponible && onAdd(producto)}
    >
      <CardContent className="flex flex-col gap-2 p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-foreground">{producto.nombre}</h3>
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
              {producto.descripcion ?? producto.categoriaNombre}
            </p>
          </div>
          {producto.esPromocion && (
            <Badge variant="secondary" className="shrink-0 text-[10px]">
              Promo
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-bold text-primary">{formatCOP(producto.precioFinal)}</span>
          {producto.disponible ? (
            <Button
              size="sm"
              variant="secondary"
              className="h-9 min-w-9 gap-1 opacity-100 transition-opacity md:h-8 md:opacity-0 md:group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onAdd(producto);
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              Agregar
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground">Agotado</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
