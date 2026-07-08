"use client";

import { Send, ShoppingBag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCOP } from "@/lib/format-cop";

interface PosMobileBarProps {
  itemsCount: number;
  totalCarrito: number;
  totalPedidoActivo: number;
  hasPedidoActivo: boolean;
  enviando: boolean;
  carritoVacio: boolean;
  sinMesas: boolean;
  onOpenCart: () => void;
  onEnviarACocina: () => void | Promise<void>;
}

export function PosMobileBar({
  itemsCount,
  totalCarrito,
  totalPedidoActivo,
  hasPedidoActivo,
  enviando,
  carritoVacio,
  sinMesas,
  onOpenCart,
  onEnviarACocina,
}: PosMobileBarProps) {
  const canOpenComanda = !sinMesas;
  const disabled = carritoVacio || sinMesas || enviando;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="shrink-0">
              {itemsCount} {itemsCount === 1 ? "ítem" : "ítems"}
            </Badge>
            {hasPedidoActivo && (
              <Badge variant="outline" className="shrink-0">
                En cocina
              </Badge>
            )}
          </div>
          <p className="mt-0.5 truncate text-sm font-bold">{formatCOP(totalCarrito)}</p>
          {hasPedidoActivo && (
            <p className="truncate text-[11px] text-muted-foreground">
              Pedido activo: {formatCOP(totalPedidoActivo)}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 gap-1.5"
          disabled={!canOpenComanda}
          onClick={onOpenCart}
        >
          <ShoppingBag className="h-4 w-4" />
          Comanda
        </Button>
        <Button
          size="sm"
          className="shrink-0 gap-1.5"
          disabled={disabled}
          onClick={() => void onEnviarACocina()}
        >
          <Send className="h-4 w-4" />
          {enviando ? "…" : "Enviar"}
        </Button>
      </div>
    </div>
  );
}
