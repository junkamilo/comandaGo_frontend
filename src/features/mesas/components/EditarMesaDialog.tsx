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
import { useActualizarMesa } from "@/features/mesas/hooks/use-actualizar-mesa";
import {
  editarMesaSchema,
  type EditarMesaFormValues,
} from "@/features/mesas/schemas/mesa.schemas";
import type { Mesa } from "@/features/mesas/types/mesa.types";
import { applyFieldErrors } from "@/features/personal/utils/apply-field-errors";

const inputClassName = "h-11";

interface EditarMesaDialogProps {
  mesa: Mesa | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditarMesaDialog({ mesa, open, onOpenChange }: EditarMesaDialogProps) {
  const form = useForm<EditarMesaFormValues>({
    resolver: zodResolver(editarMesaSchema),
    defaultValues: {
      numero: "",
      nombre: "",
      capacidad: undefined,
    },
  });

  const {
    actualizarMesa,
    isPending,
    fieldErrors,
    reset: resetMutation,
  } = useActualizarMesa(() => {
    onOpenChange(false);
    resetMutation();
  });

  useEffect(() => {
    if (!mesa || !open) return;
    form.reset({
      numero: mesa.numero,
      nombre: mesa.nombre ?? "",
      capacidad: mesa.capacidad ?? undefined,
    });
  }, [mesa, open, form]);

  useEffect(() => {
    if (!fieldErrors?.length) return;
    applyFieldErrors(fieldErrors, form.setError, ["numero", "nombre", "capacidad"]);
  }, [fieldErrors, form]);

  function onSubmit(values: EditarMesaFormValues) {
    if (!mesa) return;
    resetMutation();
    form.clearErrors();
    actualizarMesa({ id: mesa.id, values });
  }

  if (!mesa) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] gap-5 overflow-y-auto sm:max-w-lg">
        <DialogHeader className="space-y-2 pr-6">
          <DialogTitle>Editar mesa {mesa.numero}</DialogTitle>
          <DialogDescription>Actualiza los datos de la mesa.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="numero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input className={inputClassName} {...field} />
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
                  <FormLabel>Nombre (opcional)</FormLabel>
                  <FormControl>
                    <Input className={inputClassName} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacidad sugerida (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      className={inputClassName}
                      type="number"
                      min={1}
                      {...field}
                      value={field.value ?? ""}
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
                Guardar cambios
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
