"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { type Resolver, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DateTimePickerClearButton, DateTimePickerField } from "@/components/date-time";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ProductoPromoMultiSelect } from "@/features/promociones/components/ProductoPromoMultiSelect";
import { TipoPromocionFields } from "@/features/promociones/components/TipoPromocionFields";
import { useCrearPromocion } from "@/features/promociones/hooks/use-crear-promocion";
import {
  crearPromocionSchema,
  type CrearPromocionFormValues,
  type PromocionFormValues,
} from "@/features/promociones/schemas/promocion.schemas";
import { defaultNowLocalDateTime } from "@/lib/date-time-utils";
import { applyFieldErrors } from "@/features/personal/utils/apply-field-errors";

const inputClassName = "h-11";

interface NuevaPromocionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultValues: CrearPromocionFormValues = {
  nombre: "",
  descripcion: "",
  tipo: "PORCENTAJE",
  valorPorcentaje: undefined,
  valorMonto: undefined,
  valorPrecio: undefined,
  pagaCantidad: undefined,
  llevaCantidad: undefined,
  fechaInicio: defaultNowLocalDateTime(),
  fechaFin: "",
  usoMaximo: undefined,
  activo: true,
  productoIds: [],
};

export function NuevaPromocionDialog({ open, onOpenChange }: NuevaPromocionDialogProps) {
  const form = useForm<PromocionFormValues>({
    resolver: zodResolver(crearPromocionSchema) as Resolver<PromocionFormValues>,
    defaultValues,
  });

  const {
    crearPromocionAsync,
    isPending,
    fieldErrors,
    reset: resetMutation,
  } = useCrearPromocion(() => {
    onOpenChange(false);
    form.reset(defaultValues);
    resetMutation();
  });

  useEffect(() => {
    if (!fieldErrors?.length) return;
    applyFieldErrors(fieldErrors, form.setError, [
      "nombre",
      "descripcion",
      "tipo",
      "valorPorcentaje",
      "valorMonto",
      "valorPrecio",
      "pagaCantidad",
      "llevaCantidad",
      "fechaInicio",
      "fechaFin",
      "usoMaximo",
      "activo",
      "productoIds",
    ]);
  }, [fieldErrors, form]);

  useEffect(() => {
    if (!open) {
      form.reset(defaultValues);
      resetMutation();
    }
  }, [open, form, resetMutation]);

  async function onSubmit(values: CrearPromocionFormValues) {
    resetMutation();
    form.clearErrors();
    await crearPromocionAsync({ values });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] gap-5 overflow-y-auto sm:max-w-lg">
        <DialogHeader className="space-y-2 pr-6">
          <DialogTitle>Nueva promoción</DialogTitle>
          <DialogDescription>
            Crea una promoción y asocia los productos que ya existen en el menú.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input className={inputClassName} autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción (opcional)</FormLabel>
                  <FormControl>
                    <Textarea rows={2} placeholder="Descripción de la promoción" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <TipoPromocionFields form={form} />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="fechaInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha inicio</FormLabel>
                    <FormControl>
                      <DateTimePickerField
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isPending}
                        calendarTitle="Fecha de inicio"
                        calendarDescription="Selecciona el día en que comienza la promoción."
                        timeTitle="Hora de inicio"
                        timeDescription="Selecciona la hora en que comienza la promoción."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fechaFin"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between gap-2">
                      <FormLabel>Fecha fin (opcional)</FormLabel>
                      <DateTimePickerClearButton
                        visible={Boolean(field.value)}
                        disabled={isPending}
                        onClick={() => field.onChange("")}
                      />
                    </div>
                    <FormControl>
                      <DateTimePickerField
                        value={field.value || undefined}
                        onChange={field.onChange}
                        disabled={isPending}
                        calendarTitle="Fecha de fin"
                        calendarDescription="Selecciona el día en que termina la promoción."
                        timeTitle="Hora de fin"
                        timeDescription="Selecciona la hora en que termina la promoción."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="usoMaximo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Uso máximo (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      className={inputClassName}
                      type="number"
                      min={1}
                      step={1}
                      placeholder="Sin límite"
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
              name="activo"
              render={({ field }) => (
                <div className="flex min-h-11 items-center justify-between rounded-lg border border-border/60 px-3">
                  <Label htmlFor="promocion-activa-switch" className="cursor-pointer">
                    Promoción activa
                  </Label>
                  <Switch
                    id="promocion-activa-switch"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="productoIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Productos</FormLabel>
                  <FormControl>
                    <ProductoPromoMultiSelect
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-3 pt-1 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full sm:w-auto"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending} className="h-11 w-full gap-2 sm:w-auto">
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Crear promoción
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
