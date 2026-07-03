"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function ConfiguracionPage() {
  const [nombre, setNombre] = useState("Restaurante La Brasa");
  const [impoconsumo, setImpoconsumo] = useState("8");
  const [efectivo, setEfectivo] = useState(true);
  const [tarjeta, setTarjeta] = useState(true);
  const [transferencia, setTransferencia] = useState(false);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle>Datos del local</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del restaurante</Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="impoconsumo">Impoconsumo (%)</Label>
            <Input
              id="impoconsumo"
              type="number"
              value={impoconsumo}
              onChange={(e) => setImpoconsumo(e.target.value)}
              className="h-11"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle>Métodos de pago</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Efectivo", value: efectivo, set: setEfectivo },
            { label: "Tarjeta", value: tarjeta, set: setTarjeta },
            { label: "Transferencia", value: transferencia, set: setTransferencia },
          ].map((m) => (
            <div key={m.label} className="flex min-h-11 items-center justify-between">
              <span className="font-medium">{m.label}</span>
              <Switch checked={m.value} onCheckedChange={m.set} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Button className="h-11 w-full">Guardar cambios</Button>
    </div>
  );
}
