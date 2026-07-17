"use client";

import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import {
  type Control,
  type FieldArrayPath,
  type FieldValues,
  type Path,
  type PathValue,
  useFieldArray,
  useWatch,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Categoria } from "@/features/categorias/types/categoria.types";
import {
  getCategoriasPrincipalesActivas,
  getSubcategorias,
} from "@/features/categorias/utils/categoria-helpers";
import type { Producto } from "@/features/productos/types/producto.types";
import type { UnidadInsumo } from "@/features/recetas/types/receta.types";

const UNIDADES: UnidadInsumo[] = ["UND", "GR", "ML", "KG", "LT", "PORCION"];
const SIN_CATEGORIA_VALUE = "__none__";
/** Altura fija del menú desplegable (scroll interno). */
const SELECT_MENU_CLASS = "min-h-10 max-h-60";

type IngredientesFormShape = FieldValues & {
  ingredientes: Array<{
    productoId: number;
    cantidad: number;
    unidad: UnidadInsumo;
    esRemovible: boolean;
    orden: number;
  }>;
};

interface IngredientesEditorProps<T extends IngredientesFormShape> {
  control: Control<T>;
  insumos: Producto[];
  categorias: Categoria[];
  disabled?: boolean;
}

export function IngredientesEditor<T extends IngredientesFormShape>({
  control,
  insumos,
  categorias,
  disabled,
}: IngredientesEditorProps<T>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredientes" as FieldArrayPath<T>,
  });

  const watched = useWatch({ control, name: "ingredientes" as Path<T> }) as
    | IngredientesFormShape["ingredientes"]
    | undefined;

  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [subcategoriaId, setSubcategoriaId] = useState<number | null>(null);
  const [sinCategoria, setSinCategoria] = useState(false);

  const padres = useMemo(
    () => getCategoriasPrincipalesActivas(categorias),
    [categorias],
  );

  const subcategorias = useMemo(() => {
    if (categoriaId == null) return [];
    return getSubcategorias(categorias, categoriaId).filter((c) => c.activo);
  }, [categorias, categoriaId]);

  const tieneSubcategorias = subcategorias.length > 0;

  const categoriaFiltroId = useMemo(() => {
    if (sinCategoria) return null;
    if (tieneSubcategorias) return subcategoriaId;
    return categoriaId;
  }, [sinCategoria, tieneSubcategorias, subcategoriaId, categoriaId]);

  const idsYaAgregados = useMemo(
    () => new Set((watched ?? []).map((linea) => Number(linea.productoId))),
    [watched],
  );

  const insumosFiltrados = useMemo(() => {
    const filtroListo =
      sinCategoria ||
      (categoriaId != null && (!tieneSubcategorias || subcategoriaId != null));
    if (!filtroListo) return [];

    return insumos
      .filter((insumo) => {
        if (sinCategoria) return insumo.categoriaId == null;
        return insumo.categoriaId === categoriaFiltroId;
      })
      .filter((insumo) => !idsYaAgregados.has(insumo.id))
      .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  }, [
    insumos,
    sinCategoria,
    categoriaId,
    tieneSubcategorias,
    subcategoriaId,
    categoriaFiltroId,
    idsYaAgregados,
  ]);

  const nombrePorId = useMemo(() => {
    const map = new Map<number, string>();
    for (const insumo of insumos) {
      map.set(insumo.id, insumo.nombre);
    }
    return map;
  }, [insumos]);

  function handleCategoriaChange(value: string) {
    if (value === SIN_CATEGORIA_VALUE) {
      setSinCategoria(true);
      setCategoriaId(null);
      setSubcategoriaId(null);
      return;
    }
    setSinCategoria(false);
    setCategoriaId(Number(value));
    setSubcategoriaId(null);
  }

  function handleSubcategoriaChange(value: string) {
    setSubcategoriaId(Number(value));
  }

  function agregarInsumo(insumo: Producto) {
    if (idsYaAgregados.has(insumo.id)) return;
    append({
      productoId: insumo.id,
      cantidad: 1,
      unidad: "UND",
      esRemovible: false,
      orden: fields.length,
    } as PathValue<T, FieldArrayPath<T>>);
  }

  function handleInsumoSelect(value: string) {
    const insumo = insumosFiltrados.find((item) => String(item.id) === value);
    if (insumo) agregarInsumo(insumo);
  }

  const filtroActivo =
    sinCategoria ||
    (categoriaId != null && (!tieneSubcategorias || subcategoriaId != null));

  return (
    <div className="space-y-4 rounded-lg border border-border/60 p-3">
      <div className="space-y-3">
        <div className="space-y-2">
          <Label>Categoría</Label>
          <Select
            value={
              sinCategoria
                ? SIN_CATEGORIA_VALUE
                : categoriaId != null
                  ? String(categoriaId)
                  : undefined
            }
            onValueChange={handleCategoriaChange}
            disabled={disabled}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Elige una categoría" />
            </SelectTrigger>
            <SelectContent className={SELECT_MENU_CLASS}>
              <SelectItem value={SIN_CATEGORIA_VALUE}>Sin categoría (uso interno)</SelectItem>
              {padres.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {tieneSubcategorias && (
          <div className="space-y-2">
            <Label>Subcategoría</Label>
            <Select
              value={subcategoriaId != null ? String(subcategoriaId) : undefined}
              onValueChange={handleSubcategoriaChange}
              disabled={disabled}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Elige una subcategoría" />
              </SelectTrigger>
              <SelectContent className={SELECT_MENU_CLASS}>
                {subcategorias.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {filtroActivo ? (
          <div className="space-y-2">
            <Label>Insumo</Label>
            {insumosFiltrados.length === 0 ? (
              <p className="rounded-md border border-dashed border-border/60 px-3 py-3 text-sm text-muted-foreground">
                No hay insumos disponibles en esta categoría.
              </p>
            ) : (
              <Select
                key={`insumo-${categoriaFiltroId ?? "none"}-${fields.length}`}
                value={undefined}
                onValueChange={handleInsumoSelect}
                disabled={disabled}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Elige un insumo" />
                </SelectTrigger>
                <SelectContent className={SELECT_MENU_CLASS}>
                  {insumosFiltrados.map((insumo) => (
                    <SelectItem key={insumo.id} value={String(insumo.id)}>
                      {insumo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Elige una categoría
            {categoriaId != null && tieneSubcategorias ? " y su subcategoría" : ""} para ver los
            insumos.
          </p>
        )}
      </div>

      <div className="space-y-3">
        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Aún no has agregado insumos a la receta.
          </p>
        )}

        {fields.map((field, index) => {
          const productoId = Number(watched?.[index]?.productoId ?? 0);
          const nombre =
            nombrePorId.get(productoId) ?? (productoId > 0 ? `Insumo #${productoId}` : "Insumo");

          return (
            <div
              key={field.id}
              className="space-y-3 rounded-md border border-border/50 bg-muted/20 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{nombre}</p>
                  <p className="text-xs text-muted-foreground">Configura cantidad y opciones</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-destructive"
                  disabled={disabled}
                  onClick={() => remove(index)}
                  aria-label="Quitar insumo"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={control}
                  name={`ingredientes.${index}.cantidad` as Path<T>}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel>Cantidad</FormLabel>
                      <FormControl>
                        <Input type="number" min={0.01} step="0.01" disabled={disabled} {...f} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`ingredientes.${index}.unidad` as Path<T>}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel>Unidad</FormLabel>
                      <Select
                        value={String(f.value ?? "UND")}
                        onValueChange={f.onChange}
                        disabled={disabled}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className={SELECT_MENU_CLASS}>
                          {UNIDADES.map((u) => (
                            <SelectItem key={u} value={u}>
                              {u}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <FormField
                  control={control}
                  name={`ingredientes.${index}.esRemovible` as Path<T>}
                  render={({ field: f }) => (
                    <FormItem className="flex flex-row items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={Boolean(f.value)}
                          onCheckedChange={(checked) => f.onChange(checked === true)}
                          disabled={disabled}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Removible</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>

      <FormField
        control={control}
        name={"ingredientes" as Path<T>}
        render={() => (
          <FormItem>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
