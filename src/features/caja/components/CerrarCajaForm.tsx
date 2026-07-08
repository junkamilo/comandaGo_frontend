"use client";

import { useState } from "react";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PreviewCierre } from "@/features/caja/types/caja.types";
import { formatCOP } from "@/lib/format-cop";
import { cn } from "@/lib/utils";

interface CerrarCajaFormProps {
  preview: PreviewCierre;
  enviando: boolean;
  onCerrar: (params: { efectivoContado?: number; notas?: string }) => void | Promise<void>;
}

export function CerrarCajaForm({ preview, enviando, onCerrar }: CerrarCajaFormProps) {
  const [efectivoContado, setEfectivoContado] = useState("");
  const [notas, setNotas] = useState("");
  const [confirmar, setConfirmar] = useState(false);

  const contadoNum = Number(efectivoContado);
  const contadoValido = efectivoContado === "" || (!Number.isNaN(contadoNum) && contadoNum >= 0);
  const diferencia =
    efectivoContado !== "" && !Number.isNaN(contadoNum)
      ? contadoNum - preview.totalEfectivo
      : null;

  async function ejecutarCierre() {
    await onCerrar({
      efectivoContado: efectivoContado !== "" ? contadoNum : undefined,
      notas: notas.trim() || undefined,
    });
    setConfirmar(false);
    setEfectivoContado("");
    setNotas("");
  }

  return (
    <>
      <form
        className="space-y-3 rounded-lg border border-border/60 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (contadoValido) {
            setConfirmar(true);
          }
        }}
      >
        <h3 className="text-sm font-semibold">Cierre físico de caja</h3>
        <p className="text-xs text-muted-foreground">
          Efectivo según sistema: {formatCOP(preview.totalEfectivo)}
        </p>

        <div className="space-y-1.5">
          <Label htmlFor="efectivo-contado">Efectivo contado en caja</Label>
          <Input
            id="efectivo-contado"
            type="number"
            min={0}
            step="any"
            placeholder="Opcional"
            value={efectivoContado}
            onChange={(e) => setEfectivoContado(e.target.value)}
          />
        </div>

        {diferencia != null && (
          <p
            className={cn(
              "text-sm font-medium",
              diferencia > 0 && "text-emerald-400",
              diferencia < 0 && "text-destructive",
              diferencia === 0 && "text-muted-foreground",
            )}
          >
            Diferencia: {formatCOP(diferencia)}
            {diferencia < 0 && " (falta efectivo)"}
            {diferencia > 0 && " (sobra efectivo)"}
          </p>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="notas-cierre">Notas (opcional)</Label>
          <Textarea
            id="notas-cierre"
            rows={2}
            placeholder="Ej: faltaron $2.000, posible error en vuelto mesa 7"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full" disabled={enviando || !contadoValido}>
          Cerrar caja
        </Button>
      </form>

      <AlertDialog open={confirmar} onOpenChange={setConfirmar}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar cierre de caja?</AlertDialogTitle>
            <AlertDialogDescription>
              Se registrará el cierre del turno con total {formatCOP(preview.totalGeneral)}.
              {diferencia != null && ` Diferencia de efectivo: ${formatCOP(diferencia)}.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction disabled={enviando} onClick={() => void ejecutarCierre()}>
              Confirmar cierre
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
