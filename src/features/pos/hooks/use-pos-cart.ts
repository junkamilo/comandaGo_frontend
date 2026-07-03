"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { MESAS, PRODUCTOS } from "@/features/pos/data/mock-data";
import type { CarritoItem, Producto } from "@/features/pos/types/pos.types";
import { formatCOP } from "@/lib/format-cop";

export function usePosCart() {
  const [categoriaActiva, setCategoriaActiva] = useState<string>("entradas");
  const [busqueda, setBusqueda] = useState("");
  const [mesaSeleccionada, setMesaSeleccionada] = useState<string>("m1");
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);

  const productosFiltrados = useMemo(() => {
    const term = busqueda.trim().toLowerCase();
    return PRODUCTOS.filter((p) => {
      const matchCategoria = p.categoriaId === categoriaActiva;
      const matchBusqueda =
        !term ||
        p.nombre.toLowerCase().includes(term) ||
        p.descripcion.toLowerCase().includes(term);
      return matchCategoria && matchBusqueda;
    });
  }, [categoriaActiva, busqueda]);

  const total = useMemo(
    () => carrito.reduce((sum, item) => sum + item.producto.precio * item.cantidad, 0),
    [carrito],
  );

  const itemsCount = useMemo(
    () => carrito.reduce((sum, item) => sum + item.cantidad, 0),
    [carrito],
  );

  const mesaActual = MESAS.find((m) => m.id === mesaSeleccionada);

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

  function cambiarCantidad(productoId: string, delta: number) {
    setCarrito((prev) =>
      prev
        .map((item) =>
          item.producto.id === productoId ? { ...item, cantidad: item.cantidad + delta } : item,
        )
        .filter((item) => item.cantidad > 0),
    );
  }

  function eliminarItem(productoId: string) {
    setCarrito((prev) => prev.filter((item) => item.producto.id !== productoId));
  }

  function limpiarCarrito() {
    setCarrito([]);
  }

  function enviarACocina() {
    if (carrito.length === 0) {
      toast.error("La comanda está vacía", {
        description: "Agrega productos antes de enviar a cocina.",
      });
      return;
    }

    const mesa = mesaActual?.numero ?? "—";
    toast.success("Pedido enviado a cocina", {
      description: `${itemsCount} ítem(s) · Mesa ${mesa} · ${formatCOP(total)}`,
    });
    limpiarCarrito();
  }

  return {
    categoriaActiva,
    setCategoriaActiva,
    busqueda,
    setBusqueda,
    mesaSeleccionada,
    setMesaSeleccionada,
    carrito,
    productosFiltrados,
    total,
    itemsCount,
    mesaActual,
    agregarAlCarrito,
    cambiarCantidad,
    eliminarItem,
    limpiarCarrito,
    enviarACocina,
  };
}
