"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { PRODUCTOS } from "@/features/pos/data/mock-data";

export function DisponibilidadPage() {
  const [disponibles, setDisponibles] = useState<Record<string, boolean>>(
    Object.fromEntries(PRODUCTOS.map((p) => [p.id, p.disponible])),
  );

  return (
    <div className="space-y-3">
      {PRODUCTOS.map((p) => (
        <Card key={p.id} className="border-border/60 bg-card/80">
          <CardContent className="flex items-center justify-between gap-4 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-medium">{p.nombre}</p>
              <p className="text-sm text-muted-foreground capitalize">{p.categoriaId}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={disponibles[p.id] ? "default" : "secondary"}>
                {disponibles[p.id] ? "Disponible" : "Agotado"}
              </Badge>
              <Switch
                checked={disponibles[p.id]}
                onCheckedChange={(checked) =>
                  setDisponibles((prev) => ({ ...prev, [p.id]: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
