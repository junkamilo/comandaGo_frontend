"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { type Resolver, useForm } from "react-hook-form";

import { DurationPickerField } from "@/components/date-time";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCategorias } from "@/features/categorias/hooks/use-categorias";
import { applyFieldErrors } from "@/features/personal/utils/apply-field-errors";
import { useInsumos } from "@/features/productos/hooks/use-insumos";
import { IngredientesEditor } from "@/features/recetas/components/IngredientesEditor";
import { useCrearReceta } from "@/features/recetas/hooks/use-crear-receta";
import {
  crearRecetaSchema,
  type CrearRecetaFormValues,
  type RecetaFormValues,
} from "@/features/recetas/schemas/receta.schemas";

const inputClassName = "h-11";

interface NuevaRecetaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultValues: CrearRecetaFormValues = {
  nombre: "",
  descripcion: "",
  preparacion: "",
  tiempoTotalMin: undefined,
  activo: true,
  ingredientes: [],
};

export function NuevaRecetaDialog({ open, onOpenChange }: NuevaRecetaDialogProps) {
  const form = useForm<RecetaFormValues>({
    resolver: zodResolver(crearRecetaSchema) as Resolver<RecetaFormValues>,
    defaultValues,
  });

  const { categorias } = useCategorias();
  const { insumos } = useInsumos(open);

  const {
    crearRecetaAsync,
    isPending,
    fieldErrors,
    reset: resetMutation,
  } = useCrearReceta(() => {
    onOpenChange(false);
    form.reset(defaultValues);
    resetMutation();
  });

  useEffect(() => {
    if (!fieldErrors?.length) return;
    applyFieldErrors(fieldErrors, form.setError, [
      "nombre",
      "descripcion",
      "preparacion",
      "tiempoTotalMin",
      "activo",
      "ingredientes",
    ]);
  }, [fieldErrors, form]);

  useEffect(() => {
    if (!open) {
      form.reset(defaultValues);
      resetMutation();
    }
  }, [open, form, resetMutation]);

  async function onSubmit(values: CrearRecetaFormValues) {
    resetMutation();
    form.clearErrors();
    await crearRecetaAsync(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90dvh] gap-5 overflow-y-auto sm:max-w-lg"
        onPointerDownOutside={(e) => {
          const t = e.target as HTMLElement;
          if (t.closest("[data-radix-select-content]")) e.preventDefault();
        }}
        onInteractOutside={(e) => {
          const t = e.target as HTMLElement;
          if (t.closest("[data-radix-select-content]")) e.preventDefault();
        }}
      >
        <DialogHeader className="space-y-2 pr-6">
          <DialogTitle>Nueva receta</DialogTitle>
          <DialogDescription>
            Define insumos, cantidades y opciones para personalizar compuestos en el POS.
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
                    <Textarea rows={2} placeholder="Resumen corto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preparacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preparación (opcional)</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Pasos de preparación…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tiempoTotalMin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiempo</FormLabel>
                  <FormControl>
                    <DurationPickerField
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isPending}
                      placeholder="Seleccionar tiempo"
                      title="Tiempo de la receta"
                      description="Elige horas y minutos de preparación."
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
                <FormItem className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
                  <Label htmlFor="receta-activa">Activa</Label>
                  <FormControl>
                    <Switch
                      id="receta-activa"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <IngredientesEditor
              control={form.control}
              insumos={insumos}
              categorias={categorias}
              disabled={isPending}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Crear receta
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
