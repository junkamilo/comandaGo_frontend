import { Badge } from "@/components/ui/badge";
import type { ResumenPagoPedido } from "@/features/pagos/types/pago.types";
import { metodoPagoLabel } from "@/features/pagos/utils/metodo-pago";
import { formatCOP } from "@/lib/format-cop";

interface ResumenCobroPanelProps {
  resumen: ResumenPagoPedido;
}

export function ResumenCobroPanel({ resumen }: ResumenCobroPanelProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-md border border-border/60 p-2">
          <p className="text-xs text-muted-foreground">Total pedido</p>
          <p className="font-semibold">{formatCOP(resumen.totalPedido)}</p>
        </div>
        <div className="rounded-md border border-border/60 p-2">
          <p className="text-xs text-muted-foreground">Pagado</p>
          <p className="font-semibold">{formatCOP(resumen.totalPagado)}</p>
        </div>
        <div className="rounded-md border border-border/60 p-2">
          <p className="text-xs text-muted-foreground">Saldo pendiente</p>
          <p className="font-semibold text-primary">{formatCOP(resumen.saldoPendiente)}</p>
        </div>
        <div className="rounded-md border border-border/60 p-2">
          <p className="text-xs text-muted-foreground">Propinas</p>
          <p className="font-semibold">{formatCOP(resumen.totalPropinas)}</p>
        </div>
      </div>

      {resumen.pagos.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Pagos registrados</p>
          <ul className="max-h-32 space-y-1 overflow-y-auto">
            {resumen.pagos.map((pago) => (
              <li
                key={pago.id}
                className="flex items-center justify-between rounded-md border border-border/60 px-2 py-1.5 text-xs"
              >
                <span>
                  {metodoPagoLabel[pago.metodo]} · {formatCOP(pago.monto)}
                </span>
                <Badge variant="secondary" className="text-[10px]">
                  {pago.estado}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
