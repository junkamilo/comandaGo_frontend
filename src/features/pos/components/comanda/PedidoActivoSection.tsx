import { Check, Pencil, Wallet, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  estadoPagoPedidoClass,
  estadoPagoPedidoLabel,
} from "@/features/pagos/utils/estado-pago-pedido";
import type { Pedido } from "@/features/pedidos/types/pedido.types";
import {
  estadoDetalleClass,
  estadoDetalleLabel,
  puedeEntregarDetalle,
} from "@/features/pedidos/utils/estado-detalle";
import { estadoPedidoClass, estadoPedidoLabel } from "@/features/pedidos/utils/estado-pedido";
import { todosActivosEntregados, todosActivosListos } from "@/features/pedidos/utils/pedido-helpers";
import { formatCOP } from "@/lib/format-cop";
import { cn } from "@/lib/utils";

interface PedidoActivoSectionProps {
  pedidoActivo: Pedido;
  enviando: boolean;
  puedeCancelarPedidoCompleto: boolean;
  onSolicitarCancelarDetalle: (detalleId: number) => void;
  onSolicitarReemplazoDetalle: (detalleId: number) => void;
  onSolicitarCancelarPedido: () => void;
  onEntregarDetalle: (detalleId: number) => void;
  onEntregarPedidoCompleto: () => void;
  onAbrirCobro: () => void;
}

export function PedidoActivoSection({
  pedidoActivo,
  enviando,
  puedeCancelarPedidoCompleto,
  onSolicitarCancelarDetalle,
  onSolicitarReemplazoDetalle,
  onSolicitarCancelarPedido,
  onEntregarDetalle,
  onEntregarPedidoCompleto,
  onAbrirCobro,
}: PedidoActivoSectionProps) {
  const puedeEntregarPedidoCompleto = todosActivosListos(pedidoActivo);
  const puedeCobrar =
    pedidoActivo.estadoPago !== "PAGADO" && todosActivosEntregados(pedidoActivo);

  return (
    <section className="rounded-lg border border-border/60 p-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">Comanda · {pedidoActivo.numeroPedido}</h3>
        <div className="flex flex-wrap gap-1">
          <Badge className={estadoPedidoClass[pedidoActivo.estado]}>
            {estadoPedidoLabel[pedidoActivo.estado]}
          </Badge>
          <Badge className={estadoPagoPedidoClass[pedidoActivo.estadoPago]}>
            {estadoPagoPedidoLabel[pedidoActivo.estadoPago]}
          </Badge>
        </div>
      </div>

      {pedidoActivo.notas && (
        <p className="mb-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-1.5 text-xs text-amber-800 dark:text-amber-300">
          Nota pedido: {pedidoActivo.notas}
        </p>
      )}

      <ul className="space-y-2">
        {pedidoActivo.detalles.map((detalle) => (
          <li
            key={detalle.id}
            className={cn(
              "rounded-md border border-border/60 p-2",
              detalle.estado === "ENTREGADO" && "opacity-70",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium">
                  {detalle.nombreProducto} x{detalle.cantidad}
                </p>
                {detalle.notasPreparacion && (
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    {detalle.notasPreparacion}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">{formatCOP(detalle.subtotal)}</p>
              </div>
              <Badge className={estadoDetalleClass[detalle.estado]}>
                {estadoDetalleLabel[detalle.estado]}
              </Badge>
            </div>

            {detalle.estado === "PENDIENTE" && (
              <div className="mt-2 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-xs"
                  disabled={enviando}
                  onClick={() => onSolicitarCancelarDetalle(detalle.id)}
                >
                  <X className="mr-1 h-3 w-3" />
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-xs"
                  disabled={enviando}
                  onClick={() => onSolicitarReemplazoDetalle(detalle.id)}
                >
                  <Pencil className="mr-1 h-3 w-3" />
                  Cambiar
                </Button>
              </div>
            )}

            {puedeEntregarDetalle(detalle) && (
              <Button
                size="sm"
                className="mt-2 h-8 w-full text-xs"
                disabled={enviando}
                onClick={() => onEntregarDetalle(detalle.id)}
              >
                <Check className="mr-1 h-3.5 w-3.5" />
                Entregado
              </Button>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Total pedido enviado</span>
        <span className="text-sm font-semibold">{formatCOP(pedidoActivo.total)}</span>
      </div>

      {puedeCobrar && (
        <Button
          size="sm"
          className="mt-2 w-full"
          disabled={enviando}
          onClick={onAbrirCobro}
        >
          <Wallet className="mr-1.5 h-4 w-4" />
          Cobrar
        </Button>
      )}

      {puedeEntregarPedidoCompleto && (
        <Button
          size="sm"
          variant="secondary"
          className="mt-2 w-full"
          disabled={enviando}
          onClick={onEntregarPedidoCompleto}
        >
          <Check className="mr-1.5 h-4 w-4" />
          Marcar pedido entregado
        </Button>
      )}

      <Button
        variant="destructive"
        size="sm"
        className="mt-2 w-full"
        disabled={!puedeCancelarPedidoCompleto || enviando}
        onClick={onSolicitarCancelarPedido}
      >
        Cancelar pedido completo
      </Button>
    </section>
  );
}
