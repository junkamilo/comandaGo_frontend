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
  FormDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { useCategorias } from "@/features/categorias/hooks/use-categorias";
import { CategoriaHojaSelect } from "@/features/productos/components/CategoriaHojaSelect";
import { RecetaSelect } from "@/features/productos/components/RecetaSelect";
import { useCrearProducto } from "@/features/productos/hooks/use-crear-producto";
import {
  crearProductoSchema,
  type CrearProductoFormValues,
} from "@/features/productos/schemas/producto.schemas";
import { getCategoriasHoja } from "@/features/productos/utils/producto-helpers";
import { applyFieldErrors } from "@/features/personal/utils/apply-field-errors";
import { useUploadImagenProducto } from "@/features/storage/hooks/use-upload-imagen";

import { Button } from "@/components/ui/button";

const inputClassName = "h-11";

interface NuevoProductoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultValues: CrearProductoFormValues = {
  categoriaId: null,
  nombre: "",
  descripcion: "",
  precio: 0,
  tipo: "NORMAL",
  composicion: [],
  recetaId: null,
};

export function NuevoProductoDialog({ open, onOpenChange }: NuevoProductoDialogProps) {
  const { categorias } = useCategorias();
  const hojas = getCategoriasHoja(categorias);
  const [imagenUrl, setImagenUrl] = useState<string | null>(null);
  const { subirImagen, isUploading } = useUploadImagenProducto();

  const form = useForm<CrearProductoFormValues>({
    resolver: zodResolver(crearProductoSchema),
    defaultValues,
  });

  const nombre = form.watch("nombre");
  const tipo = form.watch("tipo");

  const {
    crearProductoAsync,
    isPending,
    fieldErrors,
    reset: resetMutation,
  } = useCrearProducto(() => {
    onOpenChange(false);
    form.reset(defaultValues);
    setImagenUrl(null);
    resetMutation();
  });

  useEffect(() => {
    if (!fieldErrors?.length) return;
    applyFieldErrors(fieldErrors, form.setError, [
      "categoriaId",
      "nombre",
      "descripcion",
      "precio",
      "tipo",
      "recetaId",
    ]);
  }, [fieldErrors, form]);

  useEffect(() => {
    if (!open) {
      form.reset(defaultValues);
      setImagenUrl(null);
      resetMutation();
    }
  }, [open, form, resetMutation]);

  useEffect(() => {
    if (tipo !== "COMPUESTO") {
      form.setValue("composicion", []);
      form.setValue("recetaId", null);
    }
  }, [tipo, form]);

  async function onSubmit(values: CrearProductoFormValues) {
    resetMutation();
    form.clearErrors();
    await crearProductoAsync({ values, imagenUrl });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90dvh] gap-5 overflow-y-auto sm:max-w-lg"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
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
                      Sin categoría = solo receta. Con categoría = también se vende (ej. Porciones).
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
              value={imagenUrl}
              previewNombre={nombre.trim() || "Producto"}
              uploading={isUploading}
              disabled={isPending}
              onUpload={async (file) => {
                const url = await subirImagen(file);
                setImagenUrl(url);
                return url;
              }}
              onRemove={async () => {
                setImagenUrl(null);
              }}
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
                disabled={isPending || isUploading || (tipo !== "INSUMO" && hojas.length === 0)}
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
