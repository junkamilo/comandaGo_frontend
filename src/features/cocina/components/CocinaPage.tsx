"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type EstadoCocina = "pendiente" | "preparando" | "listo";

interface ItemCocina {
  id: string;
  mesa: string;
  producto: string;
  cantidad: number;
  estado: EstadoCocina;
}

const MOCK_ITEMS: ItemCocina[] = [
  { id: "1", mesa: "M2", producto: "Bandeja paisa", cantidad: 1, estado: "pendiente" },
  { id: "2", mesa: "M6", producto: "Ajiaco", cantidad: 2, estado: "pendiente" },
  { id: "3", mesa: "M3", producto: "Hamburguesa", cantidad: 1, estado: "preparando" },
  { id: "4", mesa: "M1", producto: "Mojito", cantidad: 2, estado: "listo" },
];

const COLUMNAS: { key: EstadoCocina; label: string }[] = [
  { key: "pendiente", label: "Pendiente" },
  { key: "preparando", label: "Preparando" },
  { key: "listo", label: "Listo" },
];

export function CocinaPage() {
  const [items] = useState(MOCK_ITEMS);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {COLUMNAS.map((col) => (
        <Card key={col.key} className="border-border/60 bg-card/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{col.label}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {items
              .filter((i) => i.estado === col.key)
              .map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-border/60 bg-background/50 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline">Mesa {item.mesa}</Badge>
                    <span className="text-xs text-muted-foreground">x{item.cantidad}</span>
                  </div>
                  <p className="mt-2 font-medium">{item.producto}</p>
                </div>
              ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
