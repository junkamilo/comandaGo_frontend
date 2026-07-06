"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CategoriaPadreSelect } from "@/features/categorias/components/CategoriaPadreSelect";
import { useCategoriaActivo } from "@/features/categorias/hooks/use-categoria-activo";
import { useCategorias } from "@/features/categorias/hooks/use-categorias";
import { useActualizarCategoria } from "@/features/categorias/hooks/use-actualizar-categoria";
import {
  editarCategoriaSchema,
  type EditarCategoriaFormValues,
} from "@/features/categorias/schemas/categoria.schemas";
import type { Categoria } from "@/features/categorias/types/categoria.types";
import { tieneHijasActivas } from "@/features/categorias/utils/categoria-helpers";
import { applyFieldErrors } from "@/features/personal/utils/apply-field-errors";
import { useUploadImagenCategoria } from "@/features/storage/hooks/use-upload-imagen";

const inputClassName = "h-11";

interface EditarCategoriaDialogProps {
  categoria: Categoria | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditarCategoriaDialog({
  categoria,
  open,
  onOpenChange,
}: EditarCategoriaDialogProps) {
  const { categorias } = useCategorias();
  const [activo, setActivo] = useState(true);
  const [imagenUrl, setImagenUrl] = useState<string | null>(null);
  const [imagenEliminada, setImagenEliminada] = useState(false);
  const { subirImagen, isUploading } = useUploadImagenCategoria();

  const form = useForm<EditarCategoriaFormValues>({
    resolver: zodResolver(editarCategoriaSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      categoriaPadreId: "none",
    },
  });

  const nombre = form.watch("nombre");

  const {
    actualizarCategoriaAsync,
    isPending,
    fieldErrors,
    reset: resetMutation,
  } = useActualizarCategoria(() => {
    onOpenChange(false);
    resetMutation();
  });

  const { desactivarCategoria, toggleActivo, isDesactivando, isTogglingActivo } =
    useCategoriaActivo();

  const tieneHijas = categoria ? tieneHijasActivas(categorias, categoria.id) : false;

  useEffect(() => {
    if (!categoria || !open) return;
    setActivo(categoria.activo);
    setImagenUrl(categoria.imagenUrl);
    setImagenEliminada(false);
    form.reset({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion ?? "",
      categoriaPadreId: categoria.categoriaPadreId ?? "none",
    });
  }, [categoria, open, form]);

  useEffect(() => {
    if (!fieldErrors?.length) return;
    applyFieldErrors(fieldErrors, form.setError, [
      "nombre",
      "descripcion",
      "categoriaPadreId",
    ]);
  }, [fieldErrors, form]);

  async function onSubmit(values: EditarCategoriaFormValues) {
    if (!categoria) return;
    resetMutation();
    form.clearErrors();
    await actualizarCategoriaAsync({
      id: categoria.id,
      values,
      imagenUrl,
      imagenEliminada,
    });
  }

  function handleActivoChange(checked: boolean) {
    if (!categoria) return;

    if (checked) {
      if (categoria.categoriaPadreId) {
        const padre = categorias.find((c) => c.id === categoria.categoriaPadreId);
        if (padre && !padre.activo) {
          toast.error("Activa primero la categoría padre antes de reactivar esta subcategoría.");
          return;
        }
      }
      toggleActivo(
        { id: categoria.id, activo: true },
        { onSuccess: (data) => setActivo(data.activo) },
      );
      return;
    }

    desactivarCategoria(categoria.id, {
      onSuccess: () => setActivo(false),
    });
  }

  if (!categoria) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] gap-5 overflow-y-auto sm:max-w-lg">
        <DialogHeader className="space-y-2 pr-6">
          <DialogTitle>Editar categoría</DialogTitle>
          <DialogDescription>Actualiza los datos de {categoria.nombre}.</DialogDescription>
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

            <ImageUploadButton
              value={imagenEliminada ? null : imagenUrl}
              previewNombre={nombre.trim() || categoria.nombre}
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

            {!tieneHijas && (
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
                        excludeId={categoria.id}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {tieneHijas && (
              <p className="text-sm text-muted-foreground">
                Esta categoría tiene subcategorías activas y no puede convertirse en subcategoría.
              </p>
            )}

            <div className="flex min-h-11 items-center justify-between rounded-lg border border-border/60 px-3">
              <Label htmlFor="categoria-activa-switch" className="cursor-pointer">
                Categoría activa
              </Label>
              <Switch
                id="categoria-activa-switch"
                checked={activo}
                disabled={isDesactivando || isTogglingActivo}
                onCheckedChange={handleActivoChange}
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
                disabled={isPending || isUploading}
                className="h-11 w-full gap-2 sm:w-auto"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Guardar cambios
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
