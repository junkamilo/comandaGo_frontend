"use client";

import { CartPanel } from "@/features/pos/components/CartPanel";
import { CategorySidebar } from "@/features/pos/components/CategorySidebar";
import { PosToolbar } from "@/features/pos/components/PosToolbar";
import { ProductGrid } from "@/features/pos/components/ProductGrid";
import { usePosCart } from "@/features/pos/hooks/use-pos-cart";

export function PosPage() {
  const {
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
  } = usePosCart();

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <PosToolbar itemsCount={itemsCount} />

      <div className="flex min-h-0 flex-1">
        <CategorySidebar categoriaActiva={categoriaActiva} onSelect={setCategoriaActiva} />

        <ProductGrid
          categoriaActiva={categoriaActiva}
          busqueda={busqueda}
          productosFiltrados={productosFiltrados}
          onCategoriaChange={setCategoriaActiva}
          onBusquedaChange={setBusqueda}
          onAdd={agregarAlCarrito}
        />

        <CartPanel
          carrito={carrito}
          mesaSeleccionada={mesaSeleccionada}
          mesaActual={mesaActual}
          total={total}
          onMesaChange={setMesaSeleccionada}
          onCambiarCantidad={cambiarCantidad}
          onEliminarItem={eliminarItem}
          onLimpiarCarrito={limpiarCarrito}
          onEnviarACocina={enviarACocina}
        />
      </div>
    </div>
  );
}
