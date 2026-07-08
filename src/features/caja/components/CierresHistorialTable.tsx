import type { CierreCaja } from "@/features/caja/types/caja.types";
import { formatCOP } from "@/lib/format-cop";
import { cn } from "@/lib/utils";

interface CierresHistorialTableProps {
  cierres: CierreCaja[];
}

function formatFecha(iso: string): string {
  return new Date(iso).toLocaleString("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function CierresHistorialTable({ cierres }: CierresHistorialTableProps) {
  if (cierres.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No hay cierres de caja registrados.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border/60">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-border/60 bg-muted/30 text-left text-xs text-muted-foreground">
            <th className="p-3 font-medium">Fecha cierre</th>
            <th className="p-3 font-medium">Cajero</th>
            <th className="p-3 font-medium">Total</th>
            <th className="p-3 font-medium">Efectivo</th>
            <th className="p-3 font-medium">Diferencia</th>
            <th className="p-3 font-medium">Pedidos</th>
          </tr>
        </thead>
        <tbody>
          {cierres.map((cierre) => (
            <tr key={cierre.id} className="border-b border-border/40 last:border-0">
              <td className="p-3">{formatFecha(cierre.fechaCierre)}</td>
              <td className="p-3">{cierre.cajeroNombre ?? "—"}</td>
              <td className="p-3 font-medium">{formatCOP(cierre.totalGeneral)}</td>
              <td className="p-3">{formatCOP(cierre.totalEfectivo)}</td>
              <td
                className={cn(
                  "p-3 font-medium",
                  cierre.diferencia != null && cierre.diferencia < 0 && "text-destructive",
                  cierre.diferencia != null && cierre.diferencia > 0 && "text-emerald-400",
                )}
              >
                {cierre.diferencia != null ? formatCOP(cierre.diferencia) : "—"}
              </td>
              <td className="p-3 text-muted-foreground">
                {cierre.pedidosAtendidos} / {cierre.pedidosCancelados} canc.
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
