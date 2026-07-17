"use client";

import { CalendarCheck } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useDisponibilidadProducto } from "@/features/disponibilidad/hooks/use-disponibilidad-producto";
import type { GrupoMenuDelDia } from "@/features/disponibilidad/utils/menu-del-dia-helpers";
import type { Producto } from "@/features/productos/types/producto.types";

interface MenuDelDiaListProps {
  grupos: GrupoMenuDelDia[];
}

function ProductoDisponibilidadRow({
  producto,
  onToggle,
  disabled,
}: {
  producto: Producto;
  onToggle: (disponible: boolean) => void;
  disabled: boolean;
}) {
  return (
    <Card className="border-border/60 bg-card/80">
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="min-w-0 flex-1">
          <p className="font-medium">{producto.nombre}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={producto.disponible ? "default" : "secondary"}>
            {producto.disponible ? "Disponible" : "Agotado"}
          </Badge>
          <Switch
            checked={producto.disponible}
            disabled={disabled}
            onCheckedChange={onToggle}
            aria-label={`${producto.disponible ? "Marcar como agotado" : "Marcar como disponible"}: ${producto.nombre}`}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function MenuDelDiaList({ grupos }: MenuDelDiaListProps) {
  const { actualizarDisponibilidad, isPending, pendingId } = useDisponibilidadProducto();

  if (grupos.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 md:py-16">
        <div className="w-full max-w-lg">
          <EmptyState
            icon={CalendarCheck}
            title="No hay productos en la carta"
            description="Cuando el administrador agregue productos activos, aparecerán aquí para marcar disponibilidad del día."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-1">
      {grupos.map((grupo) => (
        <section key={grupo.categoriaId} className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {grupo.titulo}
          </h2>
          <div className="space-y-3">
            {grupo.productos.map((producto) => (
              <ProductoDisponibilidadRow
                key={producto.id}
                producto={producto}
                disabled={isPending && pendingId === producto.id}
                onToggle={(disponible) =>
                  actualizarDisponibilidad({ id: producto.id, disponible })
                }
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
