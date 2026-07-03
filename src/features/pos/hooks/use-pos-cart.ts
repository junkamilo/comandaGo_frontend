"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import type { Mesa } from "@/features/mesas/types/mesa.types";
import { useCrearPedido } from "@/features/pedidos/hooks/use-crear-pedido";
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

  const { crearPedidoAsync, isPending: enviando } = useCrearPedido(() => {
    setCarrito([]);
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
      await crearPedidoAsync({
        origen: "MESA_MESERO",
        mesaId: mesaEfectiva,
        detalles: carrito.map((item) => ({
          productoId: item.producto.id,
          cantidad: item.cantidad,
          notasPreparacion: item.notas,
        })),
      });
      return true;
    } catch {
      // toast handled in hook
      return false;
    }
  }

  return {
    categoriaActiva: categoriaEfectiva,
    setCategoriaActiva,
    busqueda,
    setBusqueda,
    mesaSeleccionada: mesaEfectiva,
    setMesaSeleccionada,
    carrito,
    productosFiltrados,
    categorias,
    mesasActivas,
    subtotal: totales.subtotal,
    impuestos: totales.impuestos,
    total: totales.total,
    itemsCount,
    mesaActual,
    enviando,
    agregarAlCarrito,
    cambiarCantidad,
    eliminarItem,
    limpiarCarrito,
    enviarACocina,
  };
}
