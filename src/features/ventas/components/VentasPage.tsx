import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_DASHBOARD } from "@/features/dashboard/data/mock-dashboard";
import { formatCOP } from "@/lib/format-cop";

const VENTAS_POR_PRODUCTO = [
  { producto: "Bandeja paisa", cantidad: 12, total: 384_000 },
  { producto: "Limonada natural", cantidad: 18, total: 162_000 },
  { producto: "Hamburguesa artesanal", cantidad: 9, total: 216_000 },
];

const VENTAS_POR_METODO = [
  { metodo: "Efectivo", total: 520_000 },
  { metodo: "Tarjeta", total: 480_000 },
  { metodo: "Transferencia", total: 240_000 },
];

export function VentasPage() {
  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle>Resumen del día</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">{formatCOP(MOCK_DASHBOARD.ventasHoy)}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle className="text-base">Por producto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {VENTAS_POR_PRODUCTO.map((v) => (
              <div
                key={v.producto}
                className="flex items-center justify-between gap-2 border-b border-border/40 pb-2 last:border-0"
              >
                <div>
                  <p className="font-medium">{v.producto}</p>
                  <p className="text-xs text-muted-foreground">{v.cantidad} vendidos</p>
                </div>
                <span className="font-semibold">{formatCOP(v.total)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle className="text-base">Por método de pago</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {VENTAS_POR_METODO.map((v) => (
              <div
                key={v.metodo}
                className="flex items-center justify-between gap-2 border-b border-border/40 pb-2 last:border-0"
              >
                <p className="font-medium">{v.metodo}</p>
                <span className="font-semibold">{formatCOP(v.total)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
