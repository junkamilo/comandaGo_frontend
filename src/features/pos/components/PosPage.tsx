"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/features/pos/components/CartDrawer";
import { CartPanel } from "@/features/pos/components/CartPanel";
import { CategorySidebar } from "@/features/pos/components/CategorySidebar";
import { PosCategoryChips } from "@/features/pos/components/PosCategoryChips";
import { PosMobileBar } from "@/features/pos/components/PosMobileBar";
import { PosMobileHeader } from "@/features/pos/components/PosMobileHeader";
import { PosSkeleton } from "@/features/pos/components/PosSkeleton";
import { PosToolbar } from "@/features/pos/components/PosToolbar";
import { ProductGrid } from "@/features/pos/components/ProductGrid";
import { usePosCart } from "@/features/pos/hooks/use-pos-cart";
import { flattenCategoriasPos } from "@/features/pos/utils/categoria-helpers";
import { useCategorias } from "@/features/categorias/hooks/use-categorias";
import { useMesasPiso } from "@/features/mesas/hooks/use-mesas-piso";
import { useProductos } from "@/features/productos/hooks/use-productos";

export function PosPage() {
  const [cartOpen, setCartOpen] = useState(false);

  const {
    productos,
    isLoading: loadingProductos,
    isError: errorProductos,
    refetch: refetchProductos,
  } = useProductos({ activo: true, disponible: true });

  const {
    categorias: categoriasTree,
    isLoading: loadingCategorias,
    isError: errorCategorias,
    refetch: refetchCategorias,
  } = useCategorias();

  const {
    mesas,
    isLoading: loadingMesas,
    isError: errorMesas,
    refetch: refetchMesas,
  } = useMesasPiso();

  const categorias = flattenCategoriasPos(categoriasTree);

  const cart = usePosCart({ productos, categorias, mesas });

  const isLoading = loadingProductos || loadingCategorias || loadingMesas;
  const isError = errorProductos || errorCategorias || errorMesas;

  async function handleEnviarACocina() {
    const ok = await cart.enviarACocina();
    if (ok) {
      setCartOpen(false);
    }
  }

  if (isLoading) {
    return <PosSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-muted-foreground">No se pudo cargar el punto de venta.</p>
        <Button
          variant="outline"
          onClick={() => {
            refetchProductos();
            refetchCategorias();
            refetchMesas();
          }}
        >
          Reintentar
        </Button>
      </div>
    );
  }

  const comandaProps = {
    carrito: cart.carrito,
    mesas: cart.mesasActivas,
    mesaSeleccionada: cart.mesaSeleccionada,
    mesaActual: cart.mesaActual,
    subtotal: cart.subtotal,
    impuestos: cart.impuestos,
    total: cart.total,
    enviando: cart.enviando,
    onMesaChange: cart.setMesaSeleccionada,
    onCambiarCantidad: cart.cambiarCantidad,
    onEliminarItem: cart.eliminarItem,
    onLimpiarCarrito: cart.limpiarCarrito,
    onEnviarACocina: handleEnviarACocina,
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <PosToolbar itemsCount={cart.itemsCount} />

      <PosMobileHeader
        mesas={cart.mesasActivas}
        mesaSeleccionada={cart.mesaSeleccionada}
        mesaActual={cart.mesaActual}
        onMesaChange={cart.setMesaSeleccionada}
      />

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <CategorySidebar
          categorias={cart.categorias}
          categoriaActiva={cart.categoriaActiva}
          onSelect={cart.setCategoriaActiva}
        />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <PosCategoryChips
            categorias={cart.categorias}
            categoriaActiva={cart.categoriaActiva}
            onSelect={cart.setCategoriaActiva}
          />

          <ProductGrid
            busqueda={cart.busqueda}
            productosFiltrados={cart.productosFiltrados}
            onBusquedaChange={cart.setBusqueda}
            onAdd={cart.agregarAlCarrito}
          />
        </div>

        <CartPanel {...comandaProps} />
      </div>

      <PosMobileBar
        itemsCount={cart.itemsCount}
        total={cart.total}
        enviando={cart.enviando}
        carritoVacio={cart.carrito.length === 0}
        sinMesas={cart.mesasActivas.length === 0}
        onOpenCart={() => setCartOpen(true)}
        onEnviarACocina={handleEnviarACocina}
      />

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} {...comandaProps} />
    </div>
  );
}
