"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { obtenerPersonalizacionProducto } from "@/features/productos/api/productos.api";
import type { Producto } from "@/features/productos/types/producto.types";
import type {
  AlternativaInsumo,
  CambioAplicado,
  CambioInsumo,
} from "@/features/pos/types/personalizacion.types";
import {
  buildNotasPreparacion,
  fromIngredientePersonalizacion,
  groupPersonalizacion,
  type PersonalizacionLinea,
} from "@/features/pos/utils/composicion-notas";
import type { AgregarAlCarritoOptions } from "@/features/pos/types/pos.types";
import { formatCOP } from "@/lib/format-cop";

interface PersonalizarProductoSheetProps {
  producto: Producto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (producto: Producto, options: AgregarAlCarritoOptions) => void;
}

export function PersonalizarProductoSheet({
  producto,
  open,
  onOpenChange,
  onConfirm,
}: PersonalizarProductoSheetProps) {
  const { data: personalizacion, isLoading } = useQuery({
    queryKey: ["productos", producto?.id, "pos-personalizacion"],
    queryFn: () => obtenerPersonalizacionProducto(producto!.id),
    enabled: open && !!producto,
  });

  const lineas = useMemo((): PersonalizacionLinea[] => {
    if (!personalizacion?.ingredientes?.length) return [];
    return personalizacion.ingredientes.map(fromIngredientePersonalizacion);
  }, [personalizacion]);

  const removibles = useMemo(() => lineas.filter((c) => c.esRemovible), [lineas]);

  const categoriasReceta = useMemo(() => groupPersonalizacion(lineas), [lineas]);

  const [incluidos, setIncluidos] = useState<Set<number>>(new Set());
  const [cambiosMap, setCambiosMap] = useState<Map<number, AlternativaInsumo>>(new Map());
  const [selectorDesdeId, setSelectorDesdeId] = useState<number | null>(null);
  const [notaLibre, setNotaLibre] = useState("");

  useEffect(() => {
    if (!open || !personalizacion) return;
    setIncluidos(new Set(removibles.map((r) => r.productoId)));
    setCambiosMap(new Map());
    setSelectorDesdeId(null);
    setNotaLibre("");
  }, [open, personalizacion?.productoId, personalizacion?.ingredientes]);

  const cambiosAplicados = useMemo((): CambioAplicado[] => {
    const result: CambioAplicado[] = [];
    for (const [desdeId, alt] of cambiosMap) {
      if (!incluidos.has(desdeId)) continue;
      const origen = lineas.find((l) => l.productoId === desdeId);
      if (!origen) continue;
      result.push({
        desdeProductoId: desdeId,
        desdeNombre: origen.nombre,
        haciaProductoId: alt.productoId,
        haciaNombre: alt.nombre,
      });
    }
    return result;
  }, [cambiosMap, incluidos, lineas]);

  const cambiosPayload = useMemo((): CambioInsumo[] => {
    return cambiosAplicados.map((c) => ({
      desdeProductoId: c.desdeProductoId,
      haciaProductoId: c.haciaProductoId,
    }));
  }, [cambiosAplicados]);

  const removidos = useMemo(
    () => removibles.filter((r) => !incluidos.has(r.productoId)),
    [removibles, incluidos],
  );

  const precioBase = personalizacion?.precioBase ?? producto?.precioFinal ?? 0;
  const totalUnitario = precioBase;
  const sinConfig = !isLoading && (!personalizacion || lineas.length === 0);

  const lineaSelector = useMemo(
    () => (selectorDesdeId != null ? lineas.find((l) => l.productoId === selectorDesdeId) : null),
    [selectorDesdeId, lineas],
  );

  const enModoCambio = selectorDesdeId != null;

  function handleSheetOpenChange(next: boolean) {
    if (!next) {
      // La X / overlay cierra primero el selector; el padre permanece abierto.
      if (selectorDesdeId != null) {
        setSelectorDesdeId(null);
        return;
      }
      onOpenChange(false);
      return;
    }
    onOpenChange(true);
  }

  function toggleIncluido(id: number) {
    setIncluidos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setCambiosMap((map) => {
          if (!map.has(id)) return map;
          const copy = new Map(map);
          copy.delete(id);
          return copy;
        });
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function aplicarCambio(desdeId: number, alternativa: AlternativaInsumo) {
    setCambiosMap((prev) => {
      const next = new Map(prev);
      if (alternativa.productoId === desdeId) {
        next.delete(desdeId);
      } else {
        next.set(desdeId, alternativa);
      }
      return next;
    });
    setIncluidos((prev) => {
      if (prev.has(desdeId)) return prev;
      const next = new Set(prev);
      next.add(desdeId);
      return next;
    });
    setSelectorDesdeId(null);
  }

  function nombreMostrado(linea: PersonalizacionLinea): string {
    const cambio = cambiosMap.get(linea.productoId);
    return cambio?.nombre ?? linea.nombre;
  }

  function handleConfirm() {
    if (!producto) return;
    const libre = notaLibre.trim();
    const notas = buildNotasPreparacion(removidos, [], cambiosAplicados, libre);
    onConfirm(producto, {
      notas,
      notasCliente: libre || undefined,
      removidosIds: removidos.map((r) => r.productoId),
      cambios: cambiosPayload.length > 0 ? cambiosPayload : undefined,
      precioUnitario: totalUnitario,
    });
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={handleSheetOpenChange}>
      <SheetContent side="bottom" className="max-h-[90dvh] overflow-y-auto sm:max-w-lg sm:rounded-t-xl">
        {enModoCambio && lineaSelector ? (
          <>
            <SheetHeader>
              <div className="flex items-center gap-2 pr-8">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => setSelectorDesdeId(null)}
                  aria-label="Volver"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="min-w-0 text-left">
                  <SheetTitle>Cambiar porción</SheetTitle>
                  <SheetDescription>
                    Reemplazar {lineaSelector.nombre} por otra opción disponible hoy.
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="space-y-2 py-4">
              {cambiosMap.has(lineaSelector.productoId) ? (
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-full justify-start"
                  onClick={() =>
                    aplicarCambio(lineaSelector.productoId, {
                      productoId: lineaSelector.productoId,
                      nombre: lineaSelector.nombre,
                    })
                  }
                >
                  {lineaSelector.nombre} (original)
                </Button>
              ) : null}
              {lineaSelector.alternativas.map((alt) => (
                <Button
                  key={alt.productoId}
                  type="button"
                  variant="outline"
                  className="h-11 w-full justify-start"
                  onClick={() => aplicarCambio(lineaSelector.productoId, alt)}
                >
                  {alt.nombre}
                </Button>
              ))}
            </div>
          </>
        ) : (
          <>
            <SheetHeader>
              <SheetTitle>
                {personalizacion?.nombre ?? producto?.nombre ?? "Personalizar"}
              </SheetTitle>
              <SheetDescription>
                Incluye fijos y removibles. Precio base {formatCOP(precioBase)}.
              </SheetDescription>
            </SheetHeader>

            {isLoading && !personalizacion ? (
              <div className="flex items-center justify-center py-10 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : sinConfig ? (
              <p className="py-6 text-sm text-muted-foreground">
                Producto compuesto sin receta configurada.
              </p>
            ) : (
              <div className="space-y-5 py-4">
                {categoriasReceta.map(({ categoria, items }) => (
                  <section key={categoria} className="space-y-3">
                    <p className="text-sm font-medium">
                      {categoria === "Sin categoría" ? "Incluye" : categoria}
                    </p>
                    {items.map((linea) => {
                      const incluido = linea.esRemovible
                        ? incluidos.has(linea.productoId)
                        : true;
                      const puedeCambiar =
                        linea.esRemovible &&
                        incluido &&
                        linea.alternativas.length > 0;

                      return (
                        <IngredienteRow
                          key={linea.productoId}
                          linea={linea}
                          nombre={nombreMostrado(linea)}
                          checked={incluido}
                          onToggle={() => toggleIncluido(linea.productoId)}
                          puedeCambiar={puedeCambiar}
                          onCambiar={() => setSelectorDesdeId(linea.productoId)}
                        />
                      );
                    })}
                  </section>
                ))}

                {lineas.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Este compuesto no tiene ingredientes configurados.
                  </p>
                )}

                <div className="space-y-2">
                  <Label htmlFor="nota-preparacion" className="text-sm font-medium">
                    Notas
                  </Label>
                  <Textarea
                    id="nota-preparacion"
                    value={notaLibre}
                    onChange={(e) => setNotaLibre(e.target.value.slice(0, 500))}
                    placeholder="Ej: poco arroz, carne tres cuartos, sin tan caliente…"
                    className="min-h-[80px] resize-none"
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground">
                    Indicaciones para cocina ({notaLibre.trim().length}/500)
                  </p>
                </div>
              </div>
            )}

            <SheetFooter className="gap-2 sm:flex-col">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total línea</span>
                <span className="font-semibold">{formatCOP(totalUnitario)}</span>
              </div>
              <Button
                className="h-11 w-full"
                onClick={handleConfirm}
                disabled={!producto || isLoading || sinConfig}
              >
                Agregar a la comanda
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function IngredienteRow({
  linea,
  nombre,
  checked,
  onToggle,
  puedeCambiar,
  onCambiar,
}: {
  linea: PersonalizacionLinea;
  nombre: string;
  checked: boolean;
  onToggle: () => void;
  puedeCambiar: boolean;
  onCambiar: () => void;
}) {
  const id = `ing-${linea.productoId}`;
  const bloqueado = !linea.esRemovible;

  return (
    <div className={`flex items-center gap-3 ${bloqueado ? "opacity-50" : ""}`}>
      <Checkbox
        id={id}
        checked={checked}
        disabled={bloqueado}
        onCheckedChange={bloqueado ? undefined : onToggle}
      />
      <Label
        htmlFor={bloqueado ? undefined : id}
        className={`min-w-0 flex-1 font-normal ${bloqueado ? "cursor-default text-muted-foreground" : ""}`}
      >
        {nombre}
        {bloqueado ? (
          <span className="ml-1.5 text-xs text-muted-foreground">(fijo)</span>
        ) : null}
      </Label>
      {puedeCambiar ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="shrink-0 text-primary"
          onClick={onCambiar}
        >
          Cambiar
        </Button>
      ) : null}
    </div>
  );
}
