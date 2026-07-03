"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useCategorias } from "@/features/categorias/hooks/use-categorias";
import { CategoriaHojaSelect } from "@/features/productos/components/CategoriaHojaSelect";
import { useCrearProducto } from "@/features/productos/hooks/use-crear-producto";
import {
  crearProductoSchema,
  type CrearProductoFormValues,
} from "@/features/productos/schemas/producto.schemas";
import { getCategoriasHoja } from "@/features/productos/utils/producto-helpers";
import { applyFieldErrors } from "@/features/personal/utils/apply-field-errors";

const inputClassName = "h-11";

interface NuevoProductoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultValues: CrearProductoFormValues = {
  categoriaId: 0,
  nombre: "",
  descripcion: "",
  precio: 0,
  esPromocion: false,
  precioPromocion: undefined,
  imagenUrl: "",
  tiempoPreparacionMin: undefined,
  orden: 0,
};

export function NuevoProductoDialog({ open, onOpenChange }: NuevoProductoDialogProps) {
  const { categorias } = useCategorias();
  const hojas = getCategoriasHoja(categorias);

  const form = useForm<CrearProductoFormValues>({
    resolver: zodResolver(crearProductoSchema),
    defaultValues,
  });

  const esPromocion = form.watch("esPromocion");

  const {
    crearProducto,
    isPending,
    fieldErrors,
    reset: resetMutation,
  } = useCrearProducto(() => {
    onOpenChange(false);
    form.reset(defaultValues);
    resetMutation();
  });

  useEffect(() => {
    if (!fieldErrors?.length) return;
    applyFieldErrors(fieldErrors, form.setError, [
      "categoriaId",
      "nombre",
      "descripcion",
      "precio",
      "esPromocion",
      "precioPromocion",
      "imagenUrl",
      "tiempoPreparacionMin",
      "orden",
    ]);
  }, [fieldErrors, form]);

  useEffect(() => {
    if (!open) {
      form.reset(defaultValues);
      resetMutation();
    }
  }, [open, form, resetMutation]);

  useEffect(() => {
    if (!esPromocion) {
      form.setValue("precioPromocion", undefined);
    }
  }, [esPromocion, form]);

  function onSubmit(values: CrearProductoFormValues) {
    resetMutation();
    form.clearErrors();
    crearProducto(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] gap-5 overflow-y-auto sm:max-w-lg">
        <DialogHeader className="space-y-2 pr-6">
          <DialogTitle>Nuevo producto</DialogTitle>
          <DialogDescription>
            Asigna el producto a una categoría hoja del menú (sin subcategorías).
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="categoriaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <FormControl>
                    <CategoriaHojaSelect
                      categorias={categorias}
                      value={field.value || undefined}
                      onValueChange={field.onChange}
                      disabled={hojas.length === 0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    <Textarea rows={3} placeholder="Descripción del producto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="precio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input className={inputClassName} type="number" min={0} step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="esPromocion"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start gap-3 space-y-0 rounded-lg border border-border/60 p-3">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="cursor-pointer">Producto en promoción</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      El precio de promoción debe ser menor al precio normal.
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {esPromocion && (
              <FormField
                control={form.control}
                name="precioPromocion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio de promoción</FormLabel>
                    <FormControl>
                      <Input
                        className={inputClassName}
                        type="number"
                        min={0}
                        step="0.01"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="tiempoPreparacionMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiempo prep. (min)</FormLabel>
                    <FormControl>
                      <Input
                        className={inputClassName}
                        type="number"
                        min={0}
                        placeholder="Opcional"
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
            </div>

            <DialogFooter className="gap-3 pt-1 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full sm:w-auto"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isPending || hojas.length === 0}
                className="h-11 w-full gap-2 sm:w-auto"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Crear producto
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
