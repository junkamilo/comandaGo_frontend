"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useProductos } from "@/features/productos/hooks/use-productos";
import { cn } from "@/lib/utils";

interface ProductoPromoMultiSelectProps {
  value: number[];
  onChange: (value: number[]) => void;
  disabled?: boolean;
}

export function ProductoPromoMultiSelect({
  value,
  onChange,
  disabled,
}: ProductoPromoMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const { productos, isLoading } = useProductos({ activo: true, size: 500 });

  const productosActivos = useMemo(() => productos.filter((p) => p.activo), [productos]);

  const productosPorCategoria = useMemo(() => {
    const grupos = new Map<string, typeof productosActivos>();
    for (const producto of productosActivos) {
      const categoria = producto.categoriaNombre ?? "Sin categoría";
      const lista = grupos.get(categoria) ?? [];
      lista.push(producto);
      grupos.set(categoria, lista);
    }
    return [...grupos.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [productosActivos]);

  const seleccionados = useMemo(
    () => productosActivos.filter((p) => value.includes(p.id)),
    [productosActivos, value],
  );

  function toggleProducto(id: number) {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  }

  function quitarProducto(id: number) {
    onChange(value.filter((v) => v !== id));
  }

  if (!isLoading && productosActivos.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
        No hay productos activos.{" "}
        <Link
          href="/carta/productos"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Crea productos primero
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled || isLoading}
            className="h-11 w-full justify-between font-normal"
          >
            {isLoading
              ? "Cargando productos..."
              : value.length > 0
                ? `${value.length} producto${value.length === 1 ? "" : "s"} seleccionado${value.length === 1 ? "" : "s"}`
                : "Seleccionar productos"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar producto..." />
            <CommandList>
              <CommandEmpty>No se encontraron productos.</CommandEmpty>
              {productosPorCategoria.map(([categoria, items]) => (
                <CommandGroup key={categoria} heading={categoria}>
                  {items.map((producto) => {
                    const selected = value.includes(producto.id);
                    return (
                      <CommandItem
                        key={producto.id}
                        value={`${producto.nombre} ${categoria}`}
                        onSelect={() => toggleProducto(producto.id)}
                      >
                        <Check
                          className={cn("mr-2 h-4 w-4", selected ? "opacity-100" : "opacity-0")}
                        />
                        <span className="truncate">{producto.nombre}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {seleccionados.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {seleccionados.map((producto) => (
            <Badge key={producto.id} variant="secondary" className="gap-1 pr-1">
              {producto.nombre}
              <button
                type="button"
                className="rounded-full p-0.5 hover:bg-muted"
                aria-label={`Quitar ${producto.nombre}`}
                onClick={() => quitarProducto(producto.id)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
