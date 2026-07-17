import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatCOP } from "@/lib/format-cop";

interface ComandaFooterActionsProps {
  subtotal: number;
  impuestos: number;
  total: number;
  enviando: boolean;
  carritoVacio: boolean;
  sinMesas: boolean;
  notasPedido: string;
  onNotasPedidoChange: (value: string) => void;
  onEnviarACocina: () => void | Promise<void>;
  onLimpiarCarrito: () => void;
}

export function ComandaFooterActions({
  subtotal,
  impuestos,
  total,
  enviando,
  carritoVacio,
  sinMesas,
  notasPedido,
  onNotasPedidoChange,
  onEnviarACocina,
  onLimpiarCarrito,
}: ComandaFooterActionsProps) {
  return (
    <div className="shrink-0 border-t border-border/60 bg-background p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="mb-3 space-y-1.5">
        <Label htmlFor="notas-pedido" className="text-xs text-muted-foreground">
          Notas del pedido
        </Label>
        <Textarea
          id="notas-pedido"
          value={notasPedido}
          onChange={(e) => onNotasPedidoChange(e.target.value.slice(0, 1000))}
          placeholder="Ej: alergia a mariscos, servir juntos, sin prisa…"
          className="min-h-[64px] resize-none text-sm"
          maxLength={1000}
        />
      </div>

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
        <span className="text-sm font-medium">Total comanda nueva</span>
        <span className="text-xl font-bold">{formatCOP(total)}</span>
      </div>

      <Separator className="mb-3" />

      <div className="flex flex-col gap-2">
        <Button
          className="w-full gap-2"
          size="lg"
          onClick={() => void onEnviarACocina()}
          disabled={carritoVacio || sinMesas || enviando}
        >
          <Send className="h-4 w-4" />
          {enviando ? "Enviando…" : "Enviar a Cocina"}
        </Button>
        {!carritoVacio && (
          <Button variant="outline" className="w-full" onClick={onLimpiarCarrito}>
            Limpiar comanda
          </Button>
        )}
      </div>
    </div>
  );
}
