"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

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
import { Textarea } from "@/components/ui/textarea";
import { CategoriaPadreSelect } from "@/features/categorias/components/CategoriaPadreSelect";
import { useCategorias } from "@/features/categorias/hooks/use-categorias";
import { useCrearCategoria } from "@/features/categorias/hooks/use-crear-categoria";
import {
  crearCategoriaSchema,
  type CrearCategoriaFormValues,
} from "@/features/categorias/schemas/categoria.schemas";
import { applyFieldErrors } from "@/features/personal/utils/apply-field-errors";

const inputClassName = "h-11";

interface NuevaCategoriaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultValues: CrearCategoriaFormValues = {
  nombre: "",
  descripcion: "",
  imagenUrl: "",
  orden: 0,
  categoriaPadreId: "none",
};

export function NuevaCategoriaDialog({ open, onOpenChange }: NuevaCategoriaDialogProps) {
  const { categorias } = useCategorias();

  const form = useForm<CrearCategoriaFormValues>({
    resolver: zodResolver(crearCategoriaSchema),
    defaultValues,
  });

  const {
    crearCategoria,
    isPending,
    fieldErrors,
    reset: resetMutation,
  } = useCrearCategoria(() => {
    onOpenChange(false);
    form.reset(defaultValues);
    resetMutation();
  });

  useEffect(() => {
    if (!fieldErrors?.length) return;
    applyFieldErrors(fieldErrors, form.setError, [
      "nombre",
      "descripcion",
      "imagenUrl",
      "orden",
      "categoriaPadreId",
    ]);
  }, [fieldErrors, form]);

  useEffect(() => {
    if (!open) {
      form.reset(defaultValues);
      resetMutation();
    }
  }, [open, form, resetMutation]);

  function onSubmit(values: CrearCategoriaFormValues) {
    resetMutation();
    form.clearErrors();
    crearCategoria(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] gap-5 overflow-y-auto sm:max-w-lg">
        <DialogHeader className="space-y-2 pr-6">
          <DialogTitle>Nueva categoría</DialogTitle>
          <DialogDescription>
            Crea una categoría principal o una subcategoría dentro de una existente.
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
                    <Textarea rows={3} placeholder="Descripción de la categoría" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imagenUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de imagen (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      className={inputClassName}
                      type="url"
                      placeholder="https://..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="orden"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Orden</FormLabel>
                  <FormControl>
                    <Input className={inputClassName} type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoriaPadreId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría padre</FormLabel>
                  <FormControl>
                    <CategoriaPadreSelect
                      categorias={categorias}
                      value={field.value}
                      onValueChange={field.onChange}
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
                Crear categoría
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
