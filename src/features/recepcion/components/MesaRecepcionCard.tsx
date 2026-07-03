"use client";

import { useMemo, useState } from "react";
import { CalendarCheck, Link2, MoreVertical, UserCheck, UserMinus } from "lucide-react";

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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useActualizarEstadoMesa } from "@/features/mesas/hooks/use-actualizar-estado-mesa";
import type { Mesa } from "@/features/mesas/types/mesa.types";
import { estadoMesaClass, estadoMesaLabel } from "@/features/mesas/utils/estado-mesa";
import { formatGrupoMesas } from "@/features/mesas/utils/mesa-helpers";
import { cn } from "@/lib/utils";

interface MesaRecepcionCardProps {
  mesa: Mesa;
}

export function MesaRecepcionCard({ mesa }: MesaRecepcionCardProps) {
  const [confirmarLiberar, setConfirmarLiberar] = useState(false);
  const { actualizarEstado, isActualizando } = useActualizarEstadoMesa(() =>
    setConfirmarLiberar(false),
  );

  const acciones = useMemo(() => {
    if (!mesa.activo || mesa.estado === "INACTIVA") return [];

    switch (mesa.estado) {
      case "LIBRE":
        return [{ label: "Reservar", estado: "RESERVADA" as const, icon: CalendarCheck }];
      case "RESERVADA":
        return [
          { label: "Sentar clientes", estado: "OCUPADA" as const, icon: UserCheck },
          { label: "Cancelar reserva", estado: "LIBRE" as const, icon: UserMinus },
        ];
      case "OCUPADA":
        return [{ label: "Liberar mesa", estado: "LIBRE" as const, icon: UserMinus }];
      default:
        return [];
    }
  }, [mesa.activo, mesa.estado]);

  function ejecutarAccion(estado: Mesa["estado"]) {
    if (estado === "LIBRE" && mesa.estado === "OCUPADA") {
      setConfirmarLiberar(true);
      return;
    }
    actualizarEstado({ id: mesa.id, estado });
  }

  function confirmarLiberarMesa() {
    actualizarEstado({ id: mesa.id, estado: "LIBRE" });
  }

  const grupoLabel = formatGrupoMesas(mesa);

  return (
    <>
      <Card className="border-border/60 bg-card/80">
        <CardContent className="flex flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-lg font-bold">{mesa.numero}</p>
              {mesa.nombre && (
                <p className="truncate text-sm text-muted-foreground">{mesa.nombre}</p>
              )}
            </div>
            {acciones.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0"
                    disabled={isActualizando}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {acciones.map((accion) => (
                    <DropdownMenuItem
                      key={accion.label}
                      onClick={() => ejecutarAccion(accion.estado)}
                      disabled={isActualizando}
                    >
                      <accion.icon className="mr-2 h-4 w-4" />
                      {accion.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={cn("border", estadoMesaClass[mesa.estado])}>
              {estadoMesaLabel[mesa.estado]}
            </Badge>
            {mesa.capacidad != null && <Badge variant="secondary">{mesa.capacidad} pax</Badge>}
            {grupoLabel && (
              <Badge variant="default" className="gap-1">
                <Link2 className="h-3 w-3" />
                {grupoLabel}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={confirmarLiberar} onOpenChange={setConfirmarLiberar}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Liberar mesa {mesa.numero}?</AlertDialogTitle>
            <AlertDialogDescription>
              La mesa pasará a estado Libre. Confirma solo si los clientes ya se retiraron.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarLiberarMesa} disabled={isActualizando}>
              Liberar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
