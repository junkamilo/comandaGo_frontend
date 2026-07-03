import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCOP } from "@/lib/format-cop";

const PAGOS = [
  { id: "1", mesa: "M2", metodo: "Efectivo", monto: 85_000, hora: "14:32" },
  { id: "2", mesa: "M6", metodo: "Tarjeta", monto: 124_000, hora: "14:15" },
  { id: "3", mesa: "M1", metodo: "Transferencia", monto: 56_000, hora: "13:50" },
];

export function CajaPage() {
  const totalDia = PAGOS.reduce((s, p) => s + p.monto, 0);

  return (
    <div className="space-y-6">
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle>Cierre del día</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Total registrado hoy</p>
          <p className="text-3xl font-bold text-primary">{formatCOP(totalDia)}</p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {PAGOS.map((pago) => (
          <Card key={pago.id} className="border-border/60 bg-card/80">
            <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">Mesa {pago.mesa}</p>
                <p className="text-sm text-muted-foreground">
                  {pago.metodo} · {pago.hora}
                </p>
              </div>
              <p className="text-lg font-bold">{formatCOP(pago.monto)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
