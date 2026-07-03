import { Card, CardContent } from "@/components/ui/card";
import type { Mesa } from "@/features/mesas/types/mesa.types";

interface RecepcionStatsProps {
  mesas: Mesa[];
}

export function RecepcionStats({ mesas }: RecepcionStatsProps) {
  const libres = mesas.filter((m) => m.estado === "LIBRE").length;
  const reservadas = mesas.filter((m) => m.estado === "RESERVADA").length;
  const ocupadas = mesas.filter((m) => m.estado === "OCUPADA").length;

  const items = [
    { label: "Libres", value: libres, className: "text-emerald-400" },
    { label: "Reservadas", value: reservadas, className: "text-blue-400" },
    { label: "Ocupadas", value: ocupadas, className: "text-amber-400" },
    { label: "Total", value: mesas.length, className: "text-foreground" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="border-border/60 bg-card/60">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className={`text-2xl font-bold tabular-nums ${item.className}`}>{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
