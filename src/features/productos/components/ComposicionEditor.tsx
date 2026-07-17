"use client";

import { Plus, Trash2 } from "lucide-react";
import {
  type Control,
  type FieldArrayPath,
  type FieldValues,
  type Path,
  type PathValue,
  type UseFormSetValue,
  useFieldArray,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Producto, UnidadInsumo } from "@/features/productos/types/producto.types";
import { formatCOP } from "@/lib/format-cop";

const UNIDADES: UnidadInsumo[] = ["UND", "GR", "ML", "KG", "LT", "PORCION"];

type ComposicionFormShape = FieldValues & {
  composicion: Array<{
    productoInsumoId: number;
    cantidad: number;
    unidad: UnidadInsumo;
    esRemovible: boolean;
    esExtra: boolean;
    precioExtra?: number | null;
    orden: number;
  }>;
};

interface ComposicionEditorProps<T extends ComposicionFormShape> {
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  insumos: Producto[];
  disabled?: boolean;
}

export function ComposicionEditor<T extends ComposicionFormShape>({
  control,
  setValue,
  insumos,
  disabled,
}: ComposicionEditorProps<T>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "composicion" as FieldArrayPath<T>,
  });

  return (
    <div className="space-y-3 rounded-lg border border-border/60 p-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium">Composición</p>
          <p className="text-xs text-muted-foreground">
            Insumos removibles y extras del producto compuesto.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 gap-1"
          disabled={disabled || insumos.length === 0}
          onClick={() =>
            append({
              productoInsumoId: insumos[0]?.id ?? 0,
              cantidad: 1,
              unidad: "UND",
              esRemovible: true,
              esExtra: false,
              precioExtra: null,
              orden: fields.length,
            } as PathValue<T, FieldArrayPath<T>>)
          }
        >
          <Plus className="h-3.5 w-3.5" />
          Agregar
        </Button>
      </div>

      {insumos.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Crea productos tipo INSUMO antes de armar la composición.
        </p>
      )}

      {fields.length === 0 && insumos.length > 0 && (
        <p className="text-sm text-muted-foreground">Agrega al menos un insumo.</p>
      )}

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="space-y-3 rounded-md border border-border/50 bg-muted/20 p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <FormField
                control={control}
                name={`composicion.${index}.productoInsumoId` as Path<T>}
                render={({ field: f }) => (
                  <FormItem className="min-w-0 flex-1">
                    <FormLabel>Insumo</FormLabel>
                    <Select
                      value={f.value ? String(f.value) : undefined}
                      onValueChange={(v) => f.onChange(Number(v))}
                      disabled={disabled}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona insumo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {insumos.map((insumo) => (
                          <SelectItem key={insumo.id} value={String(insumo.id)}>
                            {insumo.nombre}
                            {insumo.precio > 0 ? ` (${formatCOP(insumo.precio)})` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-7 shrink-0 text-destructive"
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
                name={`composicion.${index}.cantidad` as Path<T>}
                render={({ field: f }) => (
                  <FormItem>
                    <FormLabel>Cantidad</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0.01}
                        step="0.01"
                        disabled={disabled}
                        {...f}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`composicion.${index}.unidad` as Path<T>}
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
                      <SelectContent>
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
                name={`composicion.${index}.esRemovible` as Path<T>}
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
              <FormField
                control={control}
                name={`composicion.${index}.esExtra` as Path<T>}
                render={({ field: f }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={Boolean(f.value)}
                        onCheckedChange={(checked) => {
                          const isExtra = checked === true;
                          f.onChange(isExtra);
                          if (!isExtra) {
                            setValue(
                              `composicion.${index}.precioExtra` as Path<T>,
                              null as PathValue<T, Path<T>>,
                            );
                          }
                        }}
                        disabled={disabled}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Extra</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={control}
              name={`composicion.${index}.esExtra` as Path<T>}
              render={({ field: extraField }) =>
                extraField.value ? (
                  <FormField
                    control={control}
                    name={`composicion.${index}.precioExtra` as Path<T>}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel>Precio extra</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            step="0.01"
                            disabled={disabled}
                            value={(f.value as number | null | undefined) ?? ""}
                            onChange={(e) =>
                              f.onChange(e.target.value === "" ? null : Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <></>
                )
              }
            />
          </div>
        ))}
      </div>

      <FormField
        control={control}
        name={"composicion" as Path<T>}
        render={() => (
          <FormItem>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
