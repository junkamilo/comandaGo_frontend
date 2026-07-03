"use client";

import { AlertCircle, ChefHat } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CocinaKanbanSkeleton } from "@/features/cocina/components/CocinaKanbanSkeleton";
import { useActualizarEstadoDetalle } from "@/features/pedidos/hooks/use-actualizar-estado-detalle";
import { usePedidosCocina } from "@/features/pedidos/hooks/use-pedidos-cocina";
import type { ItemCocina } from "@/features/pedidos/types/pedido.types";
import {
  columnaCocina,
  type ColumnaCocina,
  siguienteEstadoDetalle,
} from "@/features/pedidos/utils/pedido-helpers";

const COLUMNAS: { key: ColumnaCocina; label: string }[] = [
  { key: "pendiente", label: "Pendiente" },
  { key: "preparando", label: "Preparando" },
  { key: "listo", label: "Listo" },
];

function accionLabel(item: ItemCocina): string | null {
  const siguiente = siguienteEstadoDetalle(item.estado);
  if (siguiente === "EN_PREPARACION") return "Iniciar";
  if (siguiente === "LISTO") return "Marcar listo";
  return null;
}

export function CocinaPage() {
  const { items, isLoading, isError, refetch } = usePedidosCocina();
  const { actualizarEstadoDetalle, isPending } = useActualizarEstadoDetalle();

  if (isLoading) {
    return <CocinaKanbanSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-muted-foreground">No se pudo cargar la cola de cocina.</p>
        <Button variant="outline" onClick={() => refetch()}>
          Reintentar
        </Button>
      </div>
    );
  }

  function handleAvanzar(item: ItemCocina) {
    const siguiente = siguienteEstadoDetalle(item.estado);
    if (!siguiente) return;
    actualizarEstadoDetalle({
      pedidoId: item.pedidoId,
      detalleId: item.detalleId,
      estado: siguiente,
      estadoPedido: item.estadoPedido,
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ChefHat className="h-4 w-4" />
          {items.length} ítem(s) en cola · actualización cada 15 s
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Actualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {COLUMNAS.map((col) => {
          const columnItems = items.filter((item) => columnaCocina(item.estado) === col.key);

          return (
            <Card key={col.key} className="border-border/60 bg-card/60">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  {col.label}
                  <Badge variant="secondary">{columnItems.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {columnItems.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">Sin ítems</p>
                ) : (
                  columnItems.map((item) => {
                    const accion = accionLabel(item);
                    return (
                      <div
                        key={`${item.pedidoId}-${item.detalleId}`}
                        className="rounded-lg border border-border/60 bg-background/50 p-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <Badge variant="outline">
                            {item.mesaNumero ? `Mesa ${item.mesaNumero}` : item.numeroPedido}
                          </Badge>
                          <span className="text-xs text-muted-foreground">x{item.cantidad}</span>
                        </div>
                        <p className="mt-2 font-medium">{item.nombreProducto}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{item.numeroPedido}</p>
                        {accion && (
                          <Button
                            className="mt-3 w-full"
                            size="sm"
                            variant={col.key === "listo" ? "secondary" : "default"}
                            disabled={isPending}
                            onClick={() => handleAvanzar(item)}
                          >
                            {accion}
                          </Button>
                        )}
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
