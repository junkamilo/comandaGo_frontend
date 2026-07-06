"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { ImageUploadButton } from "@/components/image-upload-button";
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
import { useUploadImagenCategoria } from "@/features/storage/hooks/use-upload-imagen";

const inputClassName = "h-11";

interface NuevaCategoriaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultValues: CrearCategoriaFormValues = {
  nombre: "",
  descripcion: "",
  categoriaPadreId: "none",
};

export function NuevaCategoriaDialog({ open, onOpenChange }: NuevaCategoriaDialogProps) {
  const { categorias } = useCategorias();
  const [imagenUrl, setImagenUrl] = useState<string | null>(null);
  const { subirImagen, isUploading } = useUploadImagenCategoria();

  const form = useForm<CrearCategoriaFormValues>({
    resolver: zodResolver(crearCategoriaSchema),
    defaultValues,
  });

  const nombre = form.watch("nombre");

  const {
    crearCategoriaAsync,
    isPending,
    fieldErrors,
    reset: resetMutation,
  } = useCrearCategoria(() => {
    onOpenChange(false);
    form.reset(defaultValues);
    setImagenUrl(null);
    resetMutation();
  });

  useEffect(() => {
    if (!fieldErrors?.length) return;
    applyFieldErrors(fieldErrors, form.setError, [
      "nombre",
      "descripcion",
      "categoriaPadreId",
    ]);
  }, [fieldErrors, form]);

  useEffect(() => {
    if (!open) {
      form.reset(defaultValues);
      setImagenUrl(null);
      resetMutation();
    }
  }, [open, form, resetMutation]);

  async function onSubmit(values: CrearCategoriaFormValues) {
    resetMutation();
    form.clearErrors();
    await crearCategoriaAsync({ values, imagenUrl });
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

            <ImageUploadButton
              value={imagenUrl}
              previewNombre={nombre.trim() || "Categoría"}
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
              <Button
                type="submit"
                disabled={isPending || isUploading}
                className="h-11 w-full gap-2 sm:w-auto"
              >
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
