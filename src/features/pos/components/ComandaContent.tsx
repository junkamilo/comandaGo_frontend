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
import type { Mesa } from "@/features/mesas/types/mesa.types";
import { estadoMesaClass, estadoMesaLabel } from "@/features/mesas/utils/estado-mesa";
import type { CarritoItem } from "@/features/pos/types/pos.types";
import { formatCOP } from "@/lib/format-cop";
import { cn } from "@/lib/utils";

export interface ComandaContentProps {
  carrito: CarritoItem[];
  mesas: Mesa[];
  mesaSeleccionada: number | null;
  mesaActual?: Mesa;
  subtotal: number;
  impuestos: number;
  total: number;
  enviando: boolean;
  onMesaChange: (id: number) => void;
  onCambiarCantidad: (productoId: number, delta: number) => void;
  onEliminarItem: (productoId: number) => void;
  onLimpiarCarrito: () => void;
  onEnviarACocina: () => void | Promise<void>;
  showTitle?: boolean;
  showMesaSelector?: boolean;
  className?: string;
}

export function ComandaContent({
  carrito,
  mesas,
  mesaSeleccionada,
  mesaActual,
  subtotal,
  impuestos,
  total,
  enviando,
  onMesaChange,
  onCambiarCantidad,
  onEliminarItem,
  onLimpiarCarrito,
  onEnviarACocina,
  showTitle = true,
  showMesaSelector = true,
  className,
}: ComandaContentProps) {
  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      {(showTitle || showMesaSelector) && (
        <div className="border-b border-border/60 p-4">
          {showTitle && <h2 className="font-semibold">Comanda</h2>}
          {showMesaSelector && (
            <div className={cn(showTitle && "mt-3")}>
              <label className="mb-1.5 block text-xs text-muted-foreground">Mesa</label>
              {mesas.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay mesas activas</p>
              ) : (
                <Select
                  value={mesaSeleccionada != null ? String(mesaSeleccionada) : undefined}
                  onValueChange={(value) => onMesaChange(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar mesa" />
                  </SelectTrigger>
                  <SelectContent>
                    {mesas.map((mesa) => (
                      <SelectItem key={mesa.id} value={String(mesa.id)}>
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
              )}
            </div>
          )}
          {showMesaSelector && mesaActual && (
            <p className="mt-2 text-xs text-muted-foreground">
              Estado: {estadoMesaLabel[mesaActual.estado]}
            </p>
          )}
        </div>
      )}

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
                      {formatCOP(item.producto.precioFinal)} c/u
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
                    {formatCOP(item.producto.precioFinal * item.cantidad)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>

      <div className="border-t border-border/60 p-4">
        <div className="mb-2 space-y-1 text-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatCOP(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Impoconsumo (8%)</span>
            <span>{formatCOP(impuestos)}</span>
          </div>
        </div>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium">Total</span>
          <span className="text-xl font-bold">{formatCOP(total)}</span>
        </div>
        <Separator className="mb-3" />
        <div className="flex flex-col gap-2">
          <Button
            className="w-full gap-2"
            size="lg"
            onClick={() => void onEnviarACocina()}
            disabled={carrito.length === 0 || mesas.length === 0 || enviando}
          >
            <Send className="h-4 w-4" />
            {enviando ? "Enviando…" : "Enviar a Cocina"}
          </Button>
          {carrito.length > 0 && (
            <Button variant="outline" className="w-full" onClick={onLimpiarCarrito}>
              Limpiar comanda
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
