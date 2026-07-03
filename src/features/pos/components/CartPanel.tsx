import { Minus, Plus, Send, Trash2, UtensilsCrossed } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MESAS } from "@/features/pos/data/mock-data";
import type { CarritoItem, Mesa } from "@/features/pos/types/pos.types";
import { formatCOP } from "@/lib/format-cop";
import { estadoMesaClass, estadoMesaLabel } from "@/features/pos/utils/mesa-status";
import { cn } from "@/lib/utils";

interface CartPanelProps {
  carrito: CarritoItem[];
  mesaSeleccionada: string;
  mesaActual?: Mesa;
  total: number;
  onMesaChange: (id: string) => void;
  onCambiarCantidad: (productoId: string, delta: number) => void;
  onEliminarItem: (productoId: string) => void;
  onLimpiarCarrito: () => void;
  onEnviarACocina: () => void;
}

export function CartPanel({
  carrito,
  mesaSeleccionada,
  mesaActual,
  total,
  onMesaChange,
  onCambiarCantidad,
  onEliminarItem,
  onLimpiarCarrito,
  onEnviarACocina,
}: CartPanelProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-l border-border/60 bg-card/30 sm:w-80 lg:w-96">
      <div className="border-b border-border/60 p-4">
        <h2 className="font-semibold">Comanda</h2>
        <div className="mt-3">
          <label className="mb-1.5 block text-xs text-muted-foreground">Mesa</label>
          <Select value={mesaSeleccionada} onValueChange={onMesaChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MESAS.map((mesa) => (
                <SelectItem key={mesa.id} value={mesa.id}>
                  <span className="flex items-center gap-2">
                    {mesa.numero}
                    <span
                      className={cn(
                        "rounded-full border px-1.5 py-0.5 text-[10px]",
                        estadoMesaClass[mesa.estado],
                      )}
                    >
                      {estadoMesaLabel[mesa.estado]}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {mesaActual && (
          <p className="mt-2 text-xs text-muted-foreground">
            Estado: {estadoMesaLabel[mesaActual.estado]}
          </p>
        )}
      </div>

      <ScrollArea className="flex-1 p-4">
        {carrito.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
            <UtensilsCrossed className="h-8 w-8 opacity-40" />
            <p className="text-sm">Sin productos en la comanda</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {carrito.map((item) => (
              <li
                key={item.producto.id}
                className="rounded-lg border border-border/60 bg-background/50 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.producto.nombre}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCOP(item.producto.precio)} c/u
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => onEliminarItem(item.producto.id)}
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
                      onClick={() => onCambiarCantidad(item.producto.id, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">{item.cantidad}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onCambiarCantidad(item.producto.id, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatCOP(item.producto.precio * item.cantidad)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>

      <div className="border-t border-border/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-xl font-bold">{formatCOP(total)}</span>
        </div>
        <Separator className="mb-3" />
        <div className="flex flex-col gap-2">
          <Button
            className="w-full gap-2"
            size="lg"
            onClick={onEnviarACocina}
            disabled={carrito.length === 0}
          >
            <Send className="h-4 w-4" />
            Enviar a Cocina
          </Button>
          {carrito.length > 0 && (
            <Button variant="outline" className="w-full" onClick={onLimpiarCarrito}>
              Limpiar comanda
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
