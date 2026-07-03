"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_DASHBOARD } from "@/features/dashboard/data/mock-dashboard";
import { formatCOP } from "@/lib/format-cop";

function KpiCard({ title, value }: { title: string; value: string }) {
  return (
    <Card className="border-border/60 bg-card/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold tracking-tight sm:text-3xl">{value}</p>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const [fecha, setFecha] = useState("");

  useEffect(() => {
    setFecha(
      new Intl.DateTimeFormat("es-CO", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(new Date()),
    );
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {MOCK_DASHBOARD.nombreRestaurante}
          </h2>
          <p className="mt-1 capitalize text-muted-foreground">{fecha || "\u00a0"}</p>
        </div>
        <Button asChild className="h-11 w-full shrink-0 sm:w-auto" size="lg">
          <Link href="/pedidos">
            <Plus className="h-4 w-4" />
            Nueva comanda
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Ventas hoy" value={formatCOP(MOCK_DASHBOARD.ventasHoy)} />
        <KpiCard title="Pedidos activos" value={String(MOCK_DASHBOARD.pedidosActivos)} />
        <KpiCard
          title="Mesas ocupadas"
          value={`${MOCK_DASHBOARD.mesasOcupadas} / ${MOCK_DASHBOARD.mesasTotal}`}
        />
        <KpiCard title="Ticket promedio" value={formatCOP(MOCK_DASHBOARD.ticketPromedio)} />
      </div>
    </div>
  );
}
