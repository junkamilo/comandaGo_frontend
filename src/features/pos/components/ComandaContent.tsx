import { useMemo, useState } from "react";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Mesa } from "@/features/mesas/types/mesa.types";
import type { Pedido } from "@/features/pedidos/types/pedido.types";
import { CobroPedidoSheet } from "@/features/pagos/components/CobroPedidoSheet";
import { estadoMesaClass, estadoMesaLabel } from "@/features/mesas/utils/estado-mesa";
import { CarritoNuevoSection } from "@/features/pos/components/comanda/CarritoNuevoSection";
import { ComandaFooterActions } from "@/features/pos/components/comanda/ComandaFooterActions";
import { PedidoActivoSection } from "@/features/pos/components/comanda/PedidoActivoSection";
import type { CarritoItem } from "@/features/pos/types/pos.types";
import type { Producto } from "@/features/productos/types/producto.types";
import { cn } from "@/lib/utils";

export interface ComandaContentProps {
  carrito: CarritoItem[];
  mesas: Mesa[];
  mesaSeleccionada: number | null;
  mesaActual?: Mesa;
  subtotal: number;
  impuestos: number;
  total: number;
  productosDisponibles: Producto[];
  pedidoActivo: Pedido | null;
  puedeCancelarPedidoCompleto: boolean;
  enviando: boolean;
  onMesaChange: (id: number) => void;
  onCambiarCantidad: (cartKey: string, delta: number) => void;
  onEliminarItem: (cartKey: string) => void;
  onLimpiarCarrito: () => void;
  onEnviarACocina: () => void | Promise<void>;
  onCancelarDetalle: (detalleId: number) => void | Promise<void>;
  onReemplazarDetalle: (
    detalleId: number,
    nuevoProductoId: number,
    cantidad: number,
  ) => void | Promise<void>;
  onCancelarPedidoActivo: () => void | Promise<void>;
  onEntregarDetalle: (detalleId: number) => void | Promise<void>;
  onEntregarPedidoCompleto: () => void | Promise<void>;
  notasPedido: string;
  onNotasPedidoChange: (value: string) => void;
  showTitle?: boolean;
  showMesaSelector?: boolean;
  /** En drawer móvil: oculta el footer de comanda nueva si solo hay pedido activo */
  ocultarFooterCarritoVacio?: boolean;
  className?: string;
}

export function ComandaContent({
  carrito,
  mesas,
  mesaSeleccionada,
  mesaActual,
  subtotal,
  impuestos,
  total,
  productosDisponibles,
  pedidoActivo,
  puedeCancelarPedidoCompleto,
  enviando,
  onMesaChange,
  onCambiarCantidad,
  onEliminarItem,
  onLimpiarCarrito,
  onEnviarACocina,
  onCancelarDetalle,
  onReemplazarDetalle,
  onCancelarPedidoActivo,
  onEntregarDetalle,
  onEntregarPedidoCompleto,
  notasPedido,
  onNotasPedidoChange,
  showTitle = true,
  showMesaSelector = true,
  ocultarFooterCarritoVacio = false,
  className,
}: ComandaContentProps) {
  const [detalleCancelacionPendiente, setDetalleCancelacionPendiente] = useState<number | null>(
    null,
  );
  const [confirmarCancelarPedido, setConfirmarCancelarPedido] = useState(false);
  const [cobroAbierto, setCobroAbierto] = useState(false);
  const [detalleReemplazo, setDetalleReemplazo] = useState<number | null>(null);
  const [productoReemplazo, setProductoReemplazo] = useState<number | null>(null);
  const [cantidadReemplazo, setCantidadReemplazo] = useState(1);

  const opcionesProductos = useMemo(
    () =>
      productosDisponibles
        .filter((producto) => producto.activo && producto.disponible)
        .map((producto) => ({ id: producto.id, nombre: producto.nombre })),
    [productosDisponibles],
  );

  function abrirReemplazo(detalleId: number) {
    setDetalleReemplazo(detalleId);
    setProductoReemplazo(null);
    setCantidadReemplazo(1);
  }

  function confirmarReemplazo() {
    if (detalleReemplazo == null || productoReemplazo == null || cantidadReemplazo < 1) {
      return;
    }
    void onReemplazarDetalle(detalleReemplazo, productoReemplazo, cantidadReemplazo);
    setDetalleReemplazo(null);
  }

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col overflow-hidden bg-card/30", className)}>
      {(showTitle || showMesaSelector) && (
        <div className="border-b border-border/60 p-3 md:p-4">
          {showTitle && <h2 className="font-semibold">Comanda</h2>}
          {showMesaSelector && (
            <div className={cn(showTitle && "mt-3")}>
              <label className="mb-1.5 block text-xs text-muted-foreground">Mesa</label>
              {mesas.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay mesas activas</p>
              ) : (
                <Select
                  value={mesaSeleccionada != null ? String(mesaSeleccionada) : undefined}
                  onValueChange={(value) => onMesaChange(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar mesa" />
                  </SelectTrigger>
                  <SelectContent>
                    {mesas.map((mesa) => (
                      <SelectItem key={mesa.id} value={String(mesa.id)}>
                        <span className="flex items-center gap-2">
                          {mesa.numero}
                          <span
                            className={cn(
                              "rounded-full border px-1.5 py-0.5 text-[10px]",
                              estadoMesaClass[mesa.estado],
                            )}
                          >
                            {estadoMesaLabel[mesa.estado]}
                          </span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}
          {showMesaSelector && mesaActual && (
            <p className="mt-2 text-xs text-muted-foreground">
              Estado: {estadoMesaLabel[mesaActual.estado]}
            </p>
          )}
        </div>
      )}

      <div
        data-vaul-no-drag
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] touch-pan-y"
      >
        <div
          className={cn(
            "space-y-4 p-3 md:p-4",
            ocultarFooterCarritoVacio && carrito.length === 0 && pedidoActivo != null
              ? "pb-[max(1.5rem,env(safe-area-inset-bottom))]"
              : "pb-6 md:pb-8",
          )}
        >
          {pedidoActivo && (
            <PedidoActivoSection
              pedidoActivo={pedidoActivo}
              enviando={enviando}
              puedeCancelarPedidoCompleto={puedeCancelarPedidoCompleto}
              onSolicitarCancelarDetalle={setDetalleCancelacionPendiente}
              onSolicitarReemplazoDetalle={abrirReemplazo}
              onSolicitarCancelarPedido={() => setConfirmarCancelarPedido(true)}
              onEntregarDetalle={(detalleId) => void onEntregarDetalle(detalleId)}
              onEntregarPedidoCompleto={() => void onEntregarPedidoCompleto()}
              onAbrirCobro={() => setCobroAbierto(true)}
            />
          )}
          {!(ocultarFooterCarritoVacio && carrito.length === 0 && pedidoActivo != null) && (
            <CarritoNuevoSection
              carrito={carrito}
              onCambiarCantidad={onCambiarCantidad}
              onEliminarItem={onEliminarItem}
            />
          )}
        </div>
      </div>

      {!(ocultarFooterCarritoVacio && carrito.length === 0 && pedidoActivo != null) && (
        <ComandaFooterActions
          subtotal={subtotal}
          impuestos={impuestos}
          total={total}
          enviando={enviando}
          carritoVacio={carrito.length === 0}
          sinMesas={mesas.length === 0}
          notasPedido={notasPedido}
          onNotasPedidoChange={onNotasPedidoChange}
          onEnviarACocina={onEnviarACocina}
          onLimpiarCarrito={onLimpiarCarrito}
        />
      )}

      <AlertDialog
        open={detalleCancelacionPendiente != null}
        onOpenChange={(open) => !open && setDetalleCancelacionPendiente(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cancelar este plato?</AlertDialogTitle>
            <AlertDialogDescription>
              El ítem se marcará como cancelado y se recalcularán los totales del pedido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Volver</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (detalleCancelacionPendiente != null) {
                  void onCancelarDetalle(detalleCancelacionPendiente);
                }
                setDetalleCancelacionPendiente(null);
              }}
            >
              Cancelar ítem
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmarCancelarPedido} onOpenChange={setConfirmarCancelarPedido}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cancelar pedido completo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción cancelará todos los ítems pendientes del pedido activo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Volver</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                void onCancelarPedidoActivo();
                setConfirmarCancelarPedido(false);
              }}
            >
              Cancelar pedido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={detalleReemplazo != null}
        onOpenChange={(open) => !open && setDetalleReemplazo(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reemplazar plato</DialogTitle>
            <DialogDescription>
              Selecciona el nuevo producto y la cantidad para el reemplazo del ítem pendiente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Nuevo producto</p>
              <Select
                value={productoReemplazo != null ? String(productoReemplazo) : undefined}
                onValueChange={(value) => setProductoReemplazo(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un producto" />
                </SelectTrigger>
                <SelectContent>
                  {opcionesProductos.map((producto) => (
                    <SelectItem key={producto.id} value={String(producto.id)}>
                      {producto.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Cantidad</p>
              <Input
                type="number"
                min={1}
                value={cantidadReemplazo}
                onChange={(event) =>
                  setCantidadReemplazo(Math.max(1, Number(event.target.value) || 1))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetalleReemplazo(null)}>
              Cancelar
            </Button>
            <Button onClick={confirmarReemplazo} disabled={productoReemplazo == null || enviando}>
              Guardar cambio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {pedidoActivo && (
        <CobroPedidoSheet
          open={cobroAbierto}
          onOpenChange={setCobroAbierto}
          pedidoId={pedidoActivo.id}
          numeroPedido={pedidoActivo.numeroPedido}
          mesaId={mesaSeleccionada}
        />
      )}
    </div>
  );
}
