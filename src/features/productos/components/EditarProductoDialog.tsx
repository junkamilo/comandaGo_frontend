"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
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
  FormDescription,
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCategorias } from "@/features/categorias/hooks/use-categorias";
import { obtenerProducto } from "@/features/productos/api/productos.api";
import { CategoriaHojaSelect } from "@/features/productos/components/CategoriaHojaSelect";
import { RecetaSelect } from "@/features/productos/components/RecetaSelect";
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

  const { data: productoDetalle, isLoading: loadingDetalle } = useQuery({
    queryKey: ["productos", producto?.id, "detalle"],
    queryFn: () => obtenerProducto(producto!.id),
    enabled: open && !!producto && !inactivo,
  });

  const form = useForm<EditarProductoFormValues>({
    resolver: zodResolver(editarProductoSchema),
    defaultValues: {
      categoriaId: null,
      nombre: "",
      descripcion: "",
      precio: 0,
      disponible: true,
      tipo: "NORMAL",
      composicion: [],
      recetaId: null,
    },
  });

  const nombre = form.watch("nombre");
  const tipo = form.watch("tipo");

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
    const source = productoDetalle ?? producto;
    setImagenUrl(source.imagenUrl);
    setImagenEliminada(false);
    form.reset({
      categoriaId: source.categoriaId,
      nombre: source.nombre,
      descripcion: source.descripcion ?? "",
      precio: source.precio,
      disponible: source.disponible,
      tipo: source.tipo ?? "NORMAL",
      composicion: [],
      recetaId: source.recetaId ?? null,
    });
  }, [producto, productoDetalle, open, form]);

  useEffect(() => {
    if (!fieldErrors?.length) return;
    applyFieldErrors(fieldErrors, form.setError, [
      "categoriaId",
      "nombre",
      "descripcion",
      "precio",
      "disponible",
      "tipo",
      "recetaId",
    ]);
  }, [fieldErrors, form]);

  useEffect(() => {
    if (tipo !== "COMPUESTO") {
      form.setValue("composicion", []);
      form.setValue("recetaId", null);
    }
  }, [tipo, form]);

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
      <DialogContent
        className="max-h-[90dvh] gap-5 overflow-y-auto sm:max-w-lg"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
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
        ) : loadingDetalle && !productoDetalle ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className={inputClassName}>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="NORMAL">Normal</SelectItem>
                        <SelectItem value="COMPUESTO">Compuesto</SelectItem>
                        <SelectItem value="INSUMO">Insumo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoriaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Categoría{tipo === "INSUMO" ? " (opcional)" : ""}
                    </FormLabel>
                    <FormControl>
                      <CategoriaHojaSelect
                        categorias={categorias}
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={tipo !== "INSUMO" && hojas.length === 0}
                        allowEmpty={tipo === "INSUMO"}
                      />
                    </FormControl>
                    {tipo === "INSUMO" ? (
                      <FormDescription>
                        Sin categoría = solo receta. Con categoría = también se vende (ej.
                        Porciones).
                      </FormDescription>
                    ) : null}
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
                    {tipo === "INSUMO" && (
                      <FormDescription>Puede ser 0 si solo se usa en recetas.</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {tipo === "COMPUESTO" && (
                <FormField
                  control={form.control}
                  name="recetaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Receta</FormLabel>
                      <FormControl>
                        <RecetaSelect
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isPending}
                          enabled={open && tipo === "COMPUESTO"}
                        />
                      </FormControl>
                      <FormDescription>
                        El tiempo de preparación y la personalización en POS vienen de la receta.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

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
