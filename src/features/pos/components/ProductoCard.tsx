import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Producto } from "@/features/pos/types/pos.types";
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
        "group cursor-pointer border-border/60 bg-card/80 transition-all hover:border-primary/40 hover:shadow-md",
        !producto.disponible && "opacity-50",
      )}
      onClick={() => producto.disponible && onAdd(producto)}
    >
      <CardContent className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-foreground">{producto.nombre}</h3>
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
              {producto.descripcion}
            </p>
          </div>
          {producto.destacado && (
            <Badge variant="secondary" className="shrink-0 text-[10px]">
              Top
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-bold text-primary">{formatCOP(producto.precio)}</span>
          {producto.disponible ? (
            <Button
              size="sm"
              variant="secondary"
              className="h-8 gap-1 opacity-0 transition-opacity group-hover:opacity-100"
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
