"use client";

import { useState } from "react";
import {
  Copy,
  Link2,
  Link2Off,
  MoreVertical,
  Pencil,
  QrCode,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

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
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDesagruparMesas } from "@/features/mesas/hooks/use-desagrupar-mesas";
import { useEliminarMesa } from "@/features/mesas/hooks/use-eliminar-mesa";
import type { Mesa } from "@/features/mesas/types/mesa.types";
import { estadoMesaClass, estadoMesaLabel } from "@/features/mesas/utils/estado-mesa";
import { estaEnGrupo, formatGrupoMesas, puedeAgruparse } from "@/features/mesas/utils/mesa-helpers";
import { cn } from "@/lib/utils";

interface MesaCardProps {
  mesa: Mesa;
  modoAgrupar: boolean;
  seleccionada: boolean;
  onToggleSeleccion: (id: number) => void;
  onEditar: (mesa: Mesa) => void;
}

export function MesaCard({
  mesa,
  modoAgrupar,
  seleccionada,
  onToggleSeleccion,
  onEditar,
}: MesaCardProps) {
  const [eliminarTarget, setEliminarTarget] = useState<Mesa | null>(null);
  const [desagruparTarget, setDesagruparTarget] = useState<Mesa | null>(null);

  const { eliminarMesa, isPending: isEliminando } = useEliminarMesa(() => setEliminarTarget(null));
  const { desagruparMesas, isPending: isDesagrupando } = useDesagruparMesas(() =>
    setDesagruparTarget(null),
  );

  const grupoLabel = formatGrupoMesas(mesa);
  const enGrupo = estaEnGrupo(mesa);
  const agrupable = puedeAgruparse(mesa);

  async function copiarQr() {
    try {
      await navigator.clipboard.writeText(mesa.qrToken);
      toast.success("Token QR copiado");
    } catch {
      toast.error("No se pudo copiar el token");
    }
  }

  return (
    <>
      <Card
        className={cn(
          "border-border/60 bg-card/80 transition-colors",
          enGrupo && "ring-1 ring-primary/40",
          modoAgrupar && seleccionada && "ring-2 ring-primary",
          modoAgrupar && !agrupable && "opacity-50",
        )}
      >
        <CardContent className="flex flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-start gap-2">
              {modoAgrupar && (
                <Checkbox
                  checked={seleccionada}
                  disabled={!agrupable}
                  onCheckedChange={() => onToggleSeleccion(mesa.id)}
                  className="mt-1"
                  aria-label={`Seleccionar mesa ${mesa.numero}`}
                />
              )}
              <div className="min-w-0">
                <p className="text-lg font-bold">{mesa.numero}</p>
                {mesa.nombre && (
                  <p className="truncate text-sm text-muted-foreground">{mesa.nombre}</p>
                )}
              </div>
            </div>

            {!modoAgrupar && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Acciones</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => onEditar(mesa)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={copiarQr}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar token QR
                  </DropdownMenuItem>
                  {enGrupo && mesa.grupoId && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setDesagruparTarget(mesa)}>
                        <Link2Off className="mr-2 h-4 w-4" />
                        Separar grupo
                      </DropdownMenuItem>
                    </>
                  )}
                  {!enGrupo && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setEliminarTarget(mesa)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Desactivar
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={cn("border", estadoMesaClass[mesa.estado])}>
              {estadoMesaLabel[mesa.estado]}
            </Badge>
            {mesa.capacidad != null && (
              <Badge variant="secondary">{mesa.capacidad} pax</Badge>
            )}
            {grupoLabel && (
              <Badge variant="default" className="gap-1">
                <Link2 className="h-3 w-3" />
                {grupoLabel}
              </Badge>
            )}
          </div>

          {!modoAgrupar && (
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-full gap-2"
              onClick={copiarQr}
            >
              <QrCode className="h-4 w-4" />
              Copiar QR
            </Button>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={eliminarTarget !== null} onOpenChange={(o) => !o && setEliminarTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desactivar mesa {eliminarTarget?.numero}?</AlertDialogTitle>
            <AlertDialogDescription>
              La mesa dejará de mostrarse en el piso. No se puede desactivar si está ocupada o en un
              grupo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => eliminarTarget && eliminarMesa(eliminarTarget.id)}
              disabled={isEliminando}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Desactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={desagruparTarget !== null}
        onOpenChange={(o) => !o && setDesagruparTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Separar mesas del grupo?</AlertDialogTitle>
            <AlertDialogDescription>
              {desagruparTarget &&
                `Se separarán la mesa ${desagruparTarget.numero}${
                  grupoLabel ? ` y ${grupoLabel}` : ""
                }. Quedarán libres.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                desagruparTarget?.grupoId && desagruparMesas(desagruparTarget.grupoId)
              }
              disabled={isDesagrupando}
            >
              Separar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
