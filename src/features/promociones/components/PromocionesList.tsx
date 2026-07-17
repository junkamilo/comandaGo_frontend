"use client";

import { useState } from "react";
import { MoreVertical, Pencil, Plus, Tag, Trash2 } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDesactivarPromocion } from "@/features/promociones/hooks/use-desactivar-promocion";
import type { Promocion } from "@/features/promociones/types/promocion.types";
import {
  formatPromocionResumen,
  getEstadoPromocion,
  getEstadoPromocionLabel,
  getTipoPromocionLabel,
} from "@/features/promociones/utils/promocion-helpers";

interface PromocionesListProps {
  promociones: Promocion[];
  onEditar: (promocion: Promocion) => void;
  onCrear: () => void;
}

function estadoBadgeVariant(estado: ReturnType<typeof getEstadoPromocion>) {
  switch (estado) {
    case "vigente":
      return "default" as const;
    case "programada":
      return "secondary" as const;
    case "expirada":
      return "outline" as const;
    case "inactiva":
      return "secondary" as const;
  }
}

export function PromocionesList({ promociones, onEditar, onCrear }: PromocionesListProps) {
  const [desactivarTarget, setDesactivarTarget] = useState<Promocion | null>(null);
  const { desactivarPromocion, isPending: isDesactivando } = useDesactivarPromocion(() =>
    setDesactivarTarget(null),
  );

  if (promociones.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 md:py-16">
        <div className="w-full max-w-lg">
          <EmptyState
            icon={Tag}
            title="Sin promociones"
            description="Crea promociones y asócialas a productos existentes del menú."
            action={{
              label: "Nueva promoción",
              onClick: onCrear,
              icon: Plus,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {promociones.map((promocion) => {
          const estado = getEstadoPromocion(promocion);
          const productosVisibles = promocion.productos.slice(0, 4);
          const productosRestantes = promocion.productos.length - productosVisibles.length;

          return (
            <Card key={promocion.id} className="border-border/60 bg-card/80">
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{promocion.nombre}</h3>
                    <Badge variant={estadoBadgeVariant(estado)}>
                      {getEstadoPromocionLabel(estado)}
                    </Badge>
                    <Badge variant="outline">{getTipoPromocionLabel(promocion.tipo)}</Badge>
                  </div>

                  {promocion.descripcion && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {promocion.descripcion}
                    </p>
                  )}

                  <p className="text-sm font-medium text-primary">
                    {formatPromocionResumen(promocion)}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {productosVisibles.map((producto) => (
                      <Badge key={producto.id} variant="secondary" className="text-xs">
                        {producto.nombre}
                      </Badge>
                    ))}
                    {productosRestantes > 0 && (
                      <Badge variant="outline" className="text-xs">
                        +{productosRestantes} más
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Uso: {promocion.usoActual}
                    {promocion.usoMaximo != null ? ` / ${promocion.usoMaximo}` : " (sin límite)"}
                  </p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Acciones</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => onEditar(promocion)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    {promocion.activo && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDesactivarTarget(promocion)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Desactivar
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AlertDialog
        open={desactivarTarget != null}
        onOpenChange={(open) => !open && setDesactivarTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desactivar promoción?</AlertDialogTitle>
            <AlertDialogDescription>
              La promoción &quot;{desactivarTarget?.nombre}&quot; dejará de aplicarse en pedidos
              nuevos. El historial se conserva.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDesactivando}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDesactivando}
              onClick={() => desactivarTarget && desactivarPromocion(desactivarTarget.id)}
            >
              Desactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
