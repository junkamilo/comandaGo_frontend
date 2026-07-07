"use client";

import type { UseFormReturn } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TIPO_PROMOCION_OPTIONS } from "@/features/promociones/constants/tipo-promocion";
import type { PromocionFormValues } from "@/features/promociones/schemas/promocion.schemas";
import type { TipoPromocion } from "@/features/promociones/types/promocion.types";

const inputClassName = "h-11";

interface TipoPromocionFieldsProps {
  form: UseFormReturn<PromocionFormValues>;
}

function limpiarCamposTipoAnterior(form: UseFormReturn<PromocionFormValues>, tipo: TipoPromocion) {
  if (tipo !== "PORCENTAJE") form.setValue("valorPorcentaje", undefined);
  if (tipo !== "MONTO_FIJO") form.setValue("valorMonto", undefined);
  if (tipo !== "PAGA_X_LLEVA_Y") {
    form.setValue("pagaCantidad", undefined);
    form.setValue("llevaCantidad", undefined);
  }
}

export function TipoPromocionFields({ form }: TipoPromocionFieldsProps) {
  const tipo = form.watch("tipo");

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="tipo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de promoción</FormLabel>
            <Select
              value={field.value}
              onValueChange={(value: TipoPromocion) => {
                field.onChange(value);
                limpiarCamposTipoAnterior(form, value);
              }}
            >
              <FormControl>
                <SelectTrigger className={inputClassName}>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {TIPO_PROMOCION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {tipo === "PORCENTAJE" && (
        <FormField
          control={form.control}
          name="valorPorcentaje"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Porcentaje de descuento</FormLabel>
              <FormControl>
                <Input
                  className={inputClassName}
                  type="number"
                  min={1}
                  max={100}
                  step="0.01"
                  placeholder="Ej: 20"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {tipo === "MONTO_FIJO" && (
        <FormField
          control={form.control}
          name="valorMonto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto de descuento</FormLabel>
              <FormControl>
                <Input
                  className={inputClassName}
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="Ej: 5000"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {tipo === "PAGA_X_LLEVA_Y" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="pagaCantidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paga (unidades)</FormLabel>
                <FormControl>
                  <Input
                    className={inputClassName}
                    type="number"
                    min={1}
                    step={1}
                    placeholder="Ej: 2"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="llevaCantidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lleva (unidades)</FormLabel>
                <FormControl>
                  <Input
                    className={inputClassName}
                    type="number"
                    min={2}
                    step={1}
                    placeholder="Ej: 3"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}
