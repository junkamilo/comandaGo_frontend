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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCategorias } from "@/features/categorias/hooks/use-categorias";
import { CategoriaHojaSelect } from "@/features/productos/components/CategoriaHojaSelect";
import { useActualizarProducto } from "@/features/productos/hooks/use-actualizar-producto";
import {
  editarProductoSchema,
  type EditarProductoFormValues,
} from "@/features/productos/schemas/producto.schemas";
import type { Producto } from "@/features/productos/types/producto.types";
import { getCategoriasHoja } from "@/features/productos/utils/producto-helpers";
import { applyFieldErrors } from "@/features/personal/utils/apply-field-errors";

const inputClassName = "h-11";

interface EditarProductoDialogProps {
  producto: Producto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditarProductoDialog({
  producto,
  open,
  onOpenChange,
}: EditarProductoDialogProps) {
  const { categorias } = useCategorias();
  const hojas = getCategoriasHoja(categorias);
  const inactivo = producto ? !producto.activo : false;

  const form = useForm<EditarProductoFormValues>({
    resolver: zodResolver(editarProductoSchema),
    defaultValues: {
      categoriaId: 0,
      nombre: "",
      descripcion: "",
      precio: 0,
      esPromocion: false,
      precioPromocion: undefined,
      imagenUrl: "",
      tiempoPreparacionMin: undefined,
      orden: 0,
      disponible: true,
    },
  });

  const esPromocion = form.watch("esPromocion");

  const {
    actualizarProducto,
    isPending,
    fieldErrors,
    reset: resetMutation,
  } = useActualizarProducto(() => {
    onOpenChange(false);
    resetMutation();
  });

  useEffect(() => {
    if (!producto || !open) return;
    form.reset({
      categoriaId: producto.categoriaId,
      nombre: producto.nombre,
      descripcion: producto.descripcion ?? "",
      precio: producto.precio,
      esPromocion: producto.esPromocion,
      precioPromocion: producto.precioPromocion ?? undefined,
      imagenUrl: producto.imagenUrl ?? "",
      tiempoPreparacionMin: producto.tiempoPreparacionMin ?? undefined,
      orden: producto.orden,
      disponible: producto.disponible,
    });
  }, [producto, open, form]);

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
      "disponible",
    ]);
  }, [fieldErrors, form]);

  useEffect(() => {
    if (!esPromocion) {
      form.setValue("precioPromocion", undefined);
    }
  }, [esPromocion, form]);

  function onSubmit(values: EditarProductoFormValues) {
    if (!producto) return;
    resetMutation();
    form.clearErrors();
    actualizarProducto({ id: producto.id, values });
  }

  if (!producto) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] gap-5 overflow-y-auto sm:max-w-lg">
        <DialogHeader className="space-y-2 pr-6">
          <DialogTitle>Editar producto</DialogTitle>
          <DialogDescription>
            {inactivo
              ? "Este producto fue dado de baja del menú y no se puede editar."
              : `Actualiza los datos de ${producto.nombre}.`}
          </DialogDescription>
        </DialogHeader>

        {inactivo ? (
          <DialogFooter className="gap-3 pt-1 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full sm:w-auto"
              onClick={() => onOpenChange(false)}
            >
              Cerrar
            </Button>
          </DialogFooter>
        ) : (
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
                        value={field.value}
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
                      <Input className={inputClassName} {...field} />
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
                      <Textarea rows={3} {...field} />
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
                      <Input
                        className={inputClassName}
                        type="number"
                        min={0}
                        step="0.01"
                        {...field}
                      />
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
                      <Input className={inputClassName} type="url" {...field} />
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

              <FormField
                control={form.control}
                name="disponible"
                render={({ field }) => (
                  <div className="flex min-h-11 items-center justify-between rounded-lg border border-border/60 px-3">
                    <Label htmlFor="producto-disponible-switch" className="cursor-pointer">
                      Disponible hoy
                    </Label>
                    <Switch
                      id="producto-disponible-switch"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
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
                  Guardar cambios
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
