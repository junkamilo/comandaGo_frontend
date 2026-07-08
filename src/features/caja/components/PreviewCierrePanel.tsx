import type { PreviewCierre } from "@/features/caja/types/caja.types";
import { formatCOP } from "@/lib/format-cop";

interface PreviewCierrePanelProps {
  preview: PreviewCierre;
}

const METODOS = [
  { key: "totalEfectivo" as const, label: "Efectivo" },
  { key: "totalTarjeta" as const, label: "Tarjeta" },
  { key: "totalNequi" as const, label: "Nequi" },
  { key: "totalDaviplata" as const, label: "Daviplata" },
  { key: "totalTransferencia" as const, label: "Transferencia" },
  { key: "totalOtros" as const, label: "Otros (PSE/Otro)" },
];

export function PreviewCierrePanel({ preview }: PreviewCierrePanelProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {METODOS.map(({ key, label }) => (
          <div key={key} className="rounded-lg border border-border/60 bg-background/50 p-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-semibold">{formatCOP(preview[key])}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Total general del turno</span>
          <span className="text-xl font-bold text-primary">{formatCOP(preview.totalGeneral)}</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Solo pagos confirmados (COMPLETADO). Propinas no incluidas en el total.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Propinas del turno: </span>
          <span className="font-medium">{formatCOP(preview.totalPropinas)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Pedidos atendidos: </span>
          <span className="font-medium">{preview.pedidosAtendidos}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Cancelados: </span>
          <span className="font-medium">{preview.pedidosCancelados}</span>
        </div>
      </div>
    </div>
  );
}
