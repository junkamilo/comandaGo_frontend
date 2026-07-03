"use client";

import { QrCode } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MesasGridSkeleton } from "@/features/mesas/components/MesasGridSkeleton";
import { useMesas } from "@/features/mesas/hooks/use-mesas";
import { estadoMesaClass, estadoMesaLabel } from "@/features/mesas/utils/estado-mesa";
import { cn } from "@/lib/utils";

export function MesasPage() {
  const { mesas, isLoading, isError } = useMesas();

  if (isLoading) return <MesasGridSkeleton />;

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-center text-sm text-destructive">
        No se pudieron cargar las mesas.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {mesas.map((mesa) => (
        <Card key={mesa.id} className="border-border/60 bg-card/80">
          <CardContent className="flex flex-col gap-3 p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">{mesa.numero}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                <QrCode className="h-4 w-4" />
              </Button>
            </div>
            <Badge variant="outline" className={cn("w-fit border", estadoMesaClass[mesa.estado])}>
              {estadoMesaLabel[mesa.estado]}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
