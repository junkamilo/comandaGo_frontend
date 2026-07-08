"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { Mesa } from "@/features/mesas/types/mesa.types";
import { cancelarPedido } from "@/features/pedidos/api/pedidos.api";
import { PEDIDOS_QUERY_KEYS } from "@/features/pedidos/hooks/pedidos-query-keys";
import { useAgregarDetallesPedido } from "@/features/pedidos/hooks/use-agregar-detalles-pedido";
import { useCancelarDetallesPedido } from "@/features/pedidos/hooks/use-cancelar-detalles-pedido";
import { useCrearPedido } from "@/features/pedidos/hooks/use-crear-pedido";
import { usePedidosPorMesa } from "@/features/pedidos/hooks/use-pedidos-por-mesa";
import { useReemplazarDetallePedido } from "@/features/pedidos/hooks/use-reemplazar-detalle-pedido";
import { useEntregarPedido } from "@/features/pedidos/hooks/use-entregar-pedido";
import {
  puedeCancelarDetalle,
  puedeEntregarDetalle,
  puedeReemplazarDetalle,
} from "@/features/pedidos/utils/estado-detalle";
import { calcularTotales } from "@/features/pedidos/utils/pedido-helpers";
import type { CarritoItem, CategoriaPos } from "@/features/pos/types/pos.types";
import type { Producto } from "@/features/productos/types/producto.types";

interface UsePosCartOptions {
  productos: Producto[];
  categorias: CategoriaPos[];
  mesas: Mesa[];
}

export function usePosCart({ productos, categorias, mesas }: UsePosCartOptions) {
  const [categoriaActiva, setCategoriaActiva] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [mesaSeleccionada, setMesaSeleccionada] = useState<number | null>(null);
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);

  const mesasActivas = useMemo(() => mesas.filter((m) => m.activo), [mesas]);

  const categoriaEfectiva = useMemo(() => {
    if (categoriaActiva != null && categorias.some((c) => c.id === categoriaActiva)) {
      return categoriaActiva;
    }
    return categorias[0]?.id ?? null;
  }, [categoriaActiva, categorias]);

  const mesaEfectiva = useMemo(() => {
    if (mesaSeleccionada != null && mesasActivas.some((m) => m.id === mesaSeleccionada)) {
      return mesaSeleccionada;
    }
    return mesasActivas[0]?.id ?? null;
  }, [mesaSeleccionada, mesasActivas]);

  const productosFiltrados = useMemo(() => {
    const term = busqueda.trim().toLowerCase();
    return productos.filter((p) => {
      const matchCategoria = categoriaEfectiva == null || p.categoriaId === categoriaEfectiva;
      const matchBusqueda =
        !term ||
        p.nombre.toLowerCase().includes(term) ||
        (p.descripcion?.toLowerCase().includes(term) ?? false);
      return matchCategoria && matchBusqueda && p.disponible && p.activo;
    });
  }, [productos, categoriaEfectiva, busqueda]);

  const subtotal = useMemo(
    () => carrito.reduce((sum, item) => sum + item.producto.precioFinal * item.cantidad, 0),
    [carrito],
  );

  const totales = useMemo(() => calcularTotales(subtotal), [subtotal]);

  const itemsCount = useMemo(
    () => carrito.reduce((sum, item) => sum + item.cantidad, 0),
    [carrito],
  );

  const mesaActual = mesasActivas.find((m) => m.id === mesaEfectiva);
  const queryClient = useQueryClient();
  const { pedidoActivo } = usePedidosPorMesa(mesaEfectiva);

  const { crearPedidoAsync, isPending: enviando } = useCrearPedido(() => {
    setCarrito([]);
  });
  const { agregarDetallesPedidoAsync, isPending: agregando } = useAgregarDetallesPedido(() => {
    setCarrito([]);
  });
  const { cancelarDetallesPedidoAsync, isPending: cancelandoDetalles } =
    useCancelarDetallesPedido();
  const { reemplazarDetallePedidoAsync, isPending: reemplazandoDetalle } =
    useReemplazarDetallePedido();
  const { entregarDetalleAsync, entregarCompletoAsync, isPending: entregando } =
    useEntregarPedido();
  const { mutateAsync: cancelarPedidoAsync, isPending: cancelandoPedido } = useMutation({
    mutationFn: cancelarPedido,
    onSuccess: (data) => {
      if (data.mesaId != null) {
        queryClient.invalidateQueries({ queryKey: PEDIDOS_QUERY_KEYS.porMesa(data.mesaId) });
      }
    },
  });

  function agregarAlCarrito(producto: Producto) {
    setCarrito((prev) => {
      const existente = prev.find((item) => item.producto.id === producto.id);
      if (existente) {
        return prev.map((item) =>
          item.producto.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item,
        );
      }
      return [...prev, { producto, cantidad: 1 }];
    });
  }

  function cambiarCantidad(productoId: number, delta: number) {
    setCarrito((prev) =>
      prev
        .map((item) =>
          item.producto.id === productoId ? { ...item, cantidad: item.cantidad + delta } : item,
        )
        .filter((item) => item.cantidad > 0),
    );
  }

  function eliminarItem(productoId: number) {
    setCarrito((prev) => prev.filter((item) => item.producto.id !== productoId));
  }

  function limpiarCarrito() {
    setCarrito([]);
  }

  function seleccionarMesa(id: number) {
    setMesaSeleccionada(id);
    setCarrito([]);
  }

  async function enviarACocina(): Promise<boolean> {
    if (carrito.length === 0) {
      toast.error("La comanda está vacía", {
        description: "Agrega productos antes de enviar a cocina.",
      });
      return false;
    }

    if (mesaEfectiva == null) {
      toast.error("Selecciona una mesa", {
        description: "No hay mesas activas disponibles.",
      });
      return false;
    }

    try {
      const detalles = carrito.map((item) => ({
        productoId: item.producto.id,
        cantidad: item.cantidad,
        notasPreparacion: item.notas,
      }));
      if (pedidoActivo) {
        await agregarDetallesPedidoAsync({
          pedidoId: pedidoActivo.id,
          body: { detalles },
        });
      } else {
        await crearPedidoAsync({
          origen: "MESA_MESERO",
          mesaId: mesaEfectiva,
          detalles,
        });
      }
      return true;
    } catch {
      // toast handled in hook
      return false;
    }
  }

  async function cancelarDetalle(detalleId: number): Promise<void> {
    if (!pedidoActivo) {
      return;
    }
    const detalle = pedidoActivo.detalles.find((item) => item.id === detalleId);
    if (!detalle || !puedeCancelarDetalle(detalle)) {
      return;
    }
    await cancelarDetallesPedidoAsync({
      pedidoId: pedidoActivo.id,
      body: { detalleIds: [detalleId] },
    });
  }

  async function reemplazarDetalle(
    detalleId: number,
    nuevoProductoId: number,
    cantidad = 1,
  ): Promise<void> {
    if (!pedidoActivo) {
      return;
    }
    const detalle = pedidoActivo.detalles.find((item) => item.id === detalleId);
    if (!detalle || !puedeReemplazarDetalle(detalle)) {
      return;
    }
    await reemplazarDetallePedidoAsync({
      pedidoId: pedidoActivo.id,
      detalleId,
      body: {
        nuevoProductoId,
        cantidad,
      },
    });
  }

  async function cancelarPedidoActivo(): Promise<void> {
    if (!pedidoActivo) {
      return;
    }
    await cancelarPedidoAsync(pedidoActivo.id);
  }

  async function entregarDetalle(detalleId: number): Promise<void> {
    if (!pedidoActivo) {
      return;
    }
    const detalle = pedidoActivo.detalles.find((item) => item.id === detalleId);
    if (!detalle || !puedeEntregarDetalle(detalle)) {
      return;
    }
    await entregarDetalleAsync({
      pedidoId: pedidoActivo.id,
      detalleId,
      mesaId: mesaEfectiva,
    });
  }

  async function entregarPedidoCompleto(): Promise<void> {
    if (!pedidoActivo) {
      return;
    }
    await entregarCompletoAsync(pedidoActivo.id);
  }

  const puedeCancelarPedidoCompleto = useMemo(() => {
    if (!pedidoActivo) {
      return false;
    }
    return pedidoActivo.detalles
      .filter((d) => d.estado !== "CANCELADO")
      .every((d) => d.estado === "PENDIENTE");
  }, [pedidoActivo]);

  return {
    categoriaActiva: categoriaEfectiva,
    setCategoriaActiva,
    busqueda,
    setBusqueda,
    mesaSeleccionada: mesaEfectiva,
    setMesaSeleccionada: seleccionarMesa,
    carrito,
    productosFiltrados,
    categorias,
    mesasActivas,
    subtotal: totales.subtotal,
    impuestos: totales.impuestos,
    total: totales.total,
    itemsCount,
    mesaActual,
    pedidoActivo,
    enviando:
      enviando ||
      agregando ||
      cancelandoDetalles ||
      reemplazandoDetalle ||
      cancelandoPedido ||
      entregando,
    puedeCancelarPedidoCompleto,
    agregarAlCarrito,
    cambiarCantidad,
    eliminarItem,
    limpiarCarrito,
    enviarACocina,
    cancelarDetalle,
    reemplazarDetalle,
    cancelarPedidoActivo,
    entregarDetalle,
    entregarPedidoCompleto,
  };
}
