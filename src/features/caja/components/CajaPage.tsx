"use client";

import { Loader2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CerrarCajaForm } from "@/features/caja/components/CerrarCajaForm";
import { CierresHistorialTable } from "@/features/caja/components/CierresHistorialTable";
import { PreviewCierrePanel } from "@/features/caja/components/PreviewCierrePanel";
import { useCerrarCaja } from "@/features/caja/hooks/use-cerrar-caja";
import { useCierresCaja } from "@/features/caja/hooks/use-cierres-caja";
import { usePreviewCierre } from "@/features/caja/hooks/use-preview-cierre";
import { useNavigation } from "@/features/navigation/hooks/use-navigation";

function formatRangoTurno(desde: string, hasta: string): string {
  const opts: Intl.DateTimeFormatOptions = { dateStyle: "short", timeStyle: "short" };
  return `${new Date(desde).toLocaleString("es-CO", opts)} → ${new Date(hasta).toLocaleString("es-CO", opts)}`;
}

export function CajaPage() {
  const { rol } = useNavigation();
  const esAdmin = rol === "ADMIN";

  const { data: preview, isLoading, isError, refetch } = usePreviewCierre();
  const { cerrarCajaAsync, isPending } = useCerrarCaja();
  const { data: cierres = [], isLoading: loadingHistorial } = useCierresCaja(esAdmin);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !preview) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No se pudo cargar el resumen del turno.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle>Turno actual</CardTitle>
          <CardDescription>{formatRangoTurno(preview.fechaApertura, preview.fechaActual)}</CardDescription>
        </CardHeader>
        <CardContent>
          <PreviewCierrePanel preview={preview} />
        </CardContent>
      </Card>

      <CerrarCajaForm
        preview={preview}
        enviando={isPending}
        onCerrar={async (params) => {
          await cerrarCajaAsync(params);
          await refetch();
        }}
      />

      {esAdmin && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Historial de cierres</CardTitle>
            <CardDescription>Solo visible para administradores</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingHistorial ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <CierresHistorialTable cierres={cierres} />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
