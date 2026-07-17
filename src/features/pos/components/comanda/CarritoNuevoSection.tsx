import { Minus, Plus, Trash2, UtensilsCrossed } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CarritoItem } from "@/features/pos/types/pos.types";
import { precioLineaUnitario } from "@/features/pos/types/pos.types";
import { formatCOP } from "@/lib/format-cop";

interface CarritoNuevoSectionProps {
  carrito: CarritoItem[];
  onCambiarCantidad: (cartKey: string, delta: number) => void;
  onEliminarItem: (cartKey: string) => void;
}

export function CarritoNuevoSection({
  carrito,
  onCambiarCantidad,
  onEliminarItem,
}: CarritoNuevoSectionProps) {
  if (carrito.length === 0) {
    return (
      <div className="flex h-28 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/50 text-center text-muted-foreground">
        <UtensilsCrossed className="h-7 w-7 opacity-40" />
        <p className="text-sm">Sin productos nuevos en la comanda</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {carrito.map((item) => {
        const unitario = precioLineaUnitario(item);
        return (
          <li
            key={item.cartKey}
            className="rounded-lg border border-border/60 bg-background/50 p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.producto.nombre}</p>
                <p className="text-xs text-muted-foreground">{formatCOP(unitario)} c/u</p>
                {item.notas && (
                  <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">{item.notas}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => onEliminarItem(item.cartKey)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onCambiarCantidad(item.cartKey, -1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center text-sm font-medium">{item.cantidad}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onCambiarCantidad(item.cartKey, 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <span className="text-sm font-semibold">{formatCOP(unitario * item.cantidad)}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
