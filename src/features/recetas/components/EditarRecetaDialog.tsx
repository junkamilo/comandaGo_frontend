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
import { useActualizarReceta } from "@/features/recetas/hooks/use-actualizar-receta";
import {
  editarRecetaSchema,
  type EditarRecetaFormValues,
  type RecetaFormValues,
} from "@/features/recetas/schemas/receta.schemas";
import type { Receta } from "@/features/recetas/types/receta.types";

const inputClassName = "h-11";

interface EditarRecetaDialogProps {
  receta: Receta | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function toFormValues(receta: Receta): EditarRecetaFormValues {
  return {
    nombre: receta.nombre,
    descripcion: receta.descripcion ?? "",
    preparacion: receta.preparacion ?? "",
    tiempoTotalMin: receta.tiempoTotalMin,
    activo: receta.activo,
    ingredientes: (receta.ingredientes ?? []).map((ing, index) => ({
      productoId: ing.productoId,
      cantidad: ing.cantidad,
      unidad: ing.unidad,
      esRemovible: ing.esRemovible,
      orden: ing.orden ?? index,
    })),
  };
}

export function EditarRecetaDialog({ receta, open, onOpenChange }: EditarRecetaDialogProps) {
  const form = useForm<RecetaFormValues>({
    resolver: zodResolver(editarRecetaSchema) as Resolver<RecetaFormValues>,
    defaultValues: {
      nombre: "",
      descripcion: "",
      preparacion: "",
      tiempoTotalMin: undefined,
      activo: true,
      ingredientes: [],
    },
  });

  const { categorias } = useCategorias();
  const { insumos } = useInsumos(open);

  const {
    actualizarRecetaAsync,
    isPending,
    fieldErrors,
    reset: resetMutation,
  } = useActualizarReceta(() => {
    onOpenChange(false);
    resetMutation();
  });

  useEffect(() => {
    if (open && receta) {
      form.reset(toFormValues(receta));
      resetMutation();
    }
  }, [open, receta, form, resetMutation]);

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

  async function onSubmit(values: EditarRecetaFormValues) {
    if (!receta) return;
    resetMutation();
    form.clearErrors();
    await actualizarRecetaAsync({ id: receta.id, values });
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
          <DialogTitle>Editar receta</DialogTitle>
          <DialogDescription>Actualiza ingredientes y metadatos de la receta.</DialogDescription>
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
                    <Textarea rows={2} {...field} />
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
                    <Textarea rows={4} {...field} />
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
                  <Label htmlFor="receta-edit-activa">Activa</Label>
                  <FormControl>
                    <Switch
                      id="receta-edit-activa"
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
                Guardar cambios
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
