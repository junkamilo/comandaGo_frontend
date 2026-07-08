"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MetodoPago, ResumenPagoPedido } from "@/features/pagos/types/pago.types";
import { metodoPagoLabel, metodosPagoDisponibles } from "@/features/pagos/utils/metodo-pago";
import { formatCOP } from "@/lib/format-cop";

interface RegistrarPagoFormProps {
  pedidoId: number;
  resumen: ResumenPagoPedido;
  enviando: boolean;
  onRegistrar: (params: {
    metodo: MetodoPago;
    monto: number;
    propina: number;
    montoRecibido?: number;
    referencia?: string;
  }) => void | Promise<void>;
}

export function RegistrarPagoForm({
  pedidoId,
  resumen,
  enviando,
  onRegistrar,
}: RegistrarPagoFormProps) {
  const [metodo, setMetodo] = useState<MetodoPago>("EFECTIVO");
  const [monto, setMonto] = useState("");
  const [propina, setPropina] = useState("0");
  const [montoRecibido, setMontoRecibido] = useState("");
  const [referencia, setReferencia] = useState("");

  useEffect(() => {
    setMonto(String(resumen.saldoPendiente));
    setMontoRecibido("");
    setPropina("0");
    setReferencia("");
  }, [resumen.saldoPendiente, pedidoId]);

  const montoNum = Number(monto) || 0;
  const propinaNum = Number(propina) || 0;
  const recibidoNum = Number(montoRecibido) || 0;
  const vueltoEstimado =
    metodo === "EFECTIVO" && recibidoNum > 0
      ? Math.max(0, recibidoNum - montoNum - propinaNum)
      : 0;

  const montoInvalido = montoNum <= 0 || montoNum > resumen.saldoPendiente;
  const efectivoInvalido =
    metodo === "EFECTIVO" && (recibidoNum <= 0 || recibidoNum < montoNum + propinaNum);

  async function handleSubmit() {
    if (montoInvalido || efectivoInvalido) {
      return;
    }
    await onRegistrar({
      metodo,
      monto: montoNum,
      propina: propinaNum,
      montoRecibido: metodo === "EFECTIVO" ? recibidoNum : undefined,
      referencia: referencia.trim() || undefined,
    });
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit();
      }}
    >
      <div className="space-y-1.5">
        <Label htmlFor="metodo-pago">Método de pago</Label>
        <Select value={metodo} onValueChange={(v) => setMetodo(v as MetodoPago)}>
          <SelectTrigger id="metodo-pago">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {metodosPagoDisponibles.map((m) => (
              <SelectItem key={m} value={m}>
                {metodoPagoLabel[m]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="monto-pago">Monto a pagar</Label>
        <Input
          id="monto-pago"
          type="number"
          min={0}
          step="any"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Saldo: {formatCOP(resumen.saldoPendiente)}
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="propina-pago">Propina (opcional)</Label>
        <Input
          id="propina-pago"
          type="number"
          min={0}
          step="any"
          value={propina}
          onChange={(e) => setPropina(e.target.value)}
        />
      </div>

      {metodo === "EFECTIVO" && (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="recibido-pago">Monto recibido</Label>
            <Input
              id="recibido-pago"
              type="number"
              min={0}
              step="any"
              value={montoRecibido}
              onChange={(e) => setMontoRecibido(e.target.value)}
            />
          </div>
          {vueltoEstimado > 0 && (
            <p className="text-sm font-medium text-emerald-400">
              Vuelto estimado: {formatCOP(vueltoEstimado)}
            </p>
          )}
        </>
      )}

      {metodo !== "EFECTIVO" && (
        <div className="space-y-1.5">
          <Label htmlFor="referencia-pago">Referencia (opcional)</Label>
          <Input
            id="referencia-pago"
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
            placeholder="Voucher, # transacción..."
          />
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={enviando || montoInvalido || efectivoInvalido}
      >
        Registrar pago
      </Button>
    </form>
  );
}
