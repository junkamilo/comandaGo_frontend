"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { ImageUploadButton } from "@/components/image-upload-button";
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
import { useUploadImagenProducto } from "@/features/storage/hooks/use-upload-imagen";

import { Button } from "@/components/ui/button";

const inputClassName = "h-11";

interface EditarProductoDialogProps {
  producto: Producto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditarProductoDialog({ producto, open, onOpenChange }: EditarProductoDialogProps) {
  const { categorias } = useCategorias();
  const hojas = getCategoriasHoja(categorias);
  const inactivo = producto ? !producto.activo : false;
  const [imagenUrl, setImagenUrl] = useState<string | null>(null);
  const [imagenEliminada, setImagenEliminada] = useState(false);
  const { subirImagen, isUploading } = useUploadImagenProducto();

  const form = useForm<EditarProductoFormValues>({
    resolver: zodResolver(editarProductoSchema),
    defaultValues: {
      categoriaId: 0,
      nombre: "",
      descripcion: "",
      precio: 0,
      tiempoPreparacionMin: undefined,
      disponible: true,
    },
  });

  const nombre = form.watch("nombre");

  const {
    actualizarProductoAsync,
    isPending,
    fieldErrors,
    reset: resetMutation,
  } = useActualizarProducto(() => {
    onOpenChange(false);
    resetMutation();
  });

  useEffect(() => {
    if (!producto || !open) return;
    setImagenUrl(producto.imagenUrl);
    setImagenEliminada(false);
    form.reset({
      categoriaId: producto.categoriaId,
      nombre: producto.nombre,
      descripcion: producto.descripcion ?? "",
      precio: producto.precio,
      tiempoPreparacionMin: producto.tiempoPreparacionMin ?? undefined,
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
      "tiempoPreparacionMin",
      "disponible",
    ]);
  }, [fieldErrors, form]);

  async function onSubmit(values: EditarProductoFormValues) {
    if (!producto) return;
    resetMutation();
    form.clearErrors();
    await actualizarProductoAsync({
      id: producto.id,
      values,
      imagenUrl,
      imagenEliminada,
    });
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

              <ImageUploadButton
                value={imagenEliminada ? null : imagenUrl}
                previewNombre={nombre.trim() || producto.nombre}
                uploading={isUploading}
                disabled={isPending}
                onUpload={async (file) => {
                  const url = await subirImagen(file);
                  setImagenUrl(url);
                  setImagenEliminada(false);
                  return url;
                }}
                onRemove={async () => {
                  setImagenUrl(null);
                  setImagenEliminada(true);
                }}
              />

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
                <Button
                  type="submit"
                  disabled={isPending || isUploading}
                  className="h-11 w-full gap-2 sm:w-auto"
                >
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
