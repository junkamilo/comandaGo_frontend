"use client";

import { Loader2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RegistrarPagoForm } from "@/features/pagos/components/RegistrarPagoForm";
import { ResumenCobroPanel } from "@/features/pagos/components/ResumenCobroPanel";
import { useRegistrarPago } from "@/features/pagos/hooks/use-registrar-pago";
import { useResumenPagoPedido } from "@/features/pagos/hooks/use-resumen-pago-pedido";
import type { MetodoPago } from "@/features/pagos/types/pago.types";

interface CobroPedidoSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pedidoId: number | null;
  numeroPedido: string;
  mesaId: number | null;
}

export function CobroPedidoSheet({
  open,
  onOpenChange,
  pedidoId,
  numeroPedido,
  mesaId,
}: CobroPedidoSheetProps) {
  const { data: resumen, isLoading, refetch } = useResumenPagoPedido(pedidoId, open);
  const { registrarPagoAsync, isPending } = useRegistrarPago();

  async function handleRegistrar(params: {
    metodo: MetodoPago;
    monto: number;
    propina: number;
    montoRecibido?: number;
    referencia?: string;
  }) {
    if (pedidoId == null) {
      return;
    }
    await registrarPagoAsync({
      body: {
        pedidoId,
        metodo: params.metodo,
        monto: params.monto,
        propina: params.propina,
        montoRecibido: params.montoRecibido,
        referencia: params.referencia,
      },
      mesaId,
    });
    const { data: actualizado } = await refetch();
    if (actualizado && (actualizado.saldoPendiente <= 0 || actualizado.estadoPago === "PAGADO")) {
      onOpenChange(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Cobrar pedido</SheetTitle>
          <SheetDescription>{numeroPedido}</SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-4 pb-4">
          {isLoading || !resumen ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : resumen.saldoPendiente <= 0 || resumen.estadoPago === "PAGADO" ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Este pedido ya está pagado.
            </p>
          ) : (
            <>
              <ResumenCobroPanel resumen={resumen} />
              <RegistrarPagoForm
                pedidoId={pedidoId!}
                resumen={resumen}
                enviando={isPending}
                onRegistrar={handleRegistrar}
              />
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
