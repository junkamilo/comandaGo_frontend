"use client";

import { useState } from "react";
import { BookOpen, MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";

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
import { useDesactivarReceta } from "@/features/recetas/hooks/use-desactivar-receta";
import type { Receta } from "@/features/recetas/types/receta.types";
import { formatRecetaResumen } from "@/features/recetas/utils/receta-helpers";

interface RecetasListProps {
  recetas: Receta[];
  onEditar: (receta: Receta) => void;
  onCrear: () => void;
}

export function RecetasList({ recetas, onEditar, onCrear }: RecetasListProps) {
  const [desactivarTarget, setDesactivarTarget] = useState<Receta | null>(null);
  const { desactivarReceta, isPending: isDesactivando } = useDesactivarReceta(() =>
    setDesactivarTarget(null),
  );

  if (recetas.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 md:py-16">
        <div className="w-full max-w-lg">
          <EmptyState
            icon={BookOpen}
            title="Sin recetas"
            description="Crea recetas con insumos y asígnalas a productos compuestos."
            action={{
              label: "Nueva receta",
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
        {recetas.map((receta) => (
          <Card key={receta.id} className="border-border/60 bg-card/80">
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{receta.nombre}</h3>
                  <Badge variant={receta.activo ? "default" : "secondary"}>
                    {receta.activo ? "Activa" : "Inactiva"}
                  </Badge>
                  <Badge variant="outline">{receta.totalIngredientes} ingredientes</Badge>
                </div>

                {receta.descripcion && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">{receta.descripcion}</p>
                )}

                <p className="text-sm text-muted-foreground">
                  {formatRecetaResumen(receta.tiempoTotalMin)}
                </p>

                {Object.keys(receta.ingredientesPorCategoria ?? {}).length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {Object.keys(receta.ingredientesPorCategoria).map((categoria) => (
                      <Badge key={categoria} variant="secondary" className="text-xs">
                        {categoria}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="shrink-0" aria-label="Acciones">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEditar(receta)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  {receta.activo && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDesactivarTarget(receta)}
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
        ))}
      </div>

      <AlertDialog
        open={desactivarTarget !== null}
        onOpenChange={(open) => !open && setDesactivarTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desactivar receta?</AlertDialogTitle>
            <AlertDialogDescription>
              {desactivarTarget?.nombre} dejará de poder asignarse a productos nuevos. Los productos
              que ya la usan mantienen el vínculo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDesactivando}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => desactivarTarget && desactivarReceta(desactivarTarget.id)}
            >
              Desactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
