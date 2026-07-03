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
import { useCrearMesa } from "@/features/mesas/hooks/use-crear-mesa";
import {
  crearMesaSchema,
  type CrearMesaFormValues,
} from "@/features/mesas/schemas/mesa.schemas";
import { applyFieldErrors } from "@/features/personal/utils/apply-field-errors";

const inputClassName = "h-11";

interface NuevaMesaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultValues: CrearMesaFormValues = {
  numero: "",
  nombre: "",
  capacidad: undefined,
};

export function NuevaMesaDialog({ open, onOpenChange }: NuevaMesaDialogProps) {
  const form = useForm<CrearMesaFormValues>({
    resolver: zodResolver(crearMesaSchema),
    defaultValues,
  });

  const {
    crearMesa,
    isPending,
    fieldErrors,
    reset: resetMutation,
  } = useCrearMesa(() => {
    onOpenChange(false);
    form.reset(defaultValues);
    resetMutation();
  });

  useEffect(() => {
    if (!fieldErrors?.length) return;
    applyFieldErrors(fieldErrors, form.setError, ["numero", "nombre", "capacidad"]);
  }, [fieldErrors, form]);

  useEffect(() => {
    if (!open) {
      form.reset(defaultValues);
      resetMutation();
    }
  }, [open, form, resetMutation]);

  function onSubmit(values: CrearMesaFormValues) {
    resetMutation();
    form.clearErrors();
    crearMesa(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] gap-5 overflow-y-auto sm:max-w-lg">
        <DialogHeader className="space-y-2 pr-6">
          <DialogTitle>Nueva mesa</DialogTitle>
          <DialogDescription>
            El código QR se genera automáticamente. La capacidad es solo informativa.
          </DialogDescription>
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
                    <Input className={inputClassName} placeholder="12, Terraza-3" {...field} />
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
                    <Input className={inputClassName} placeholder="Ventana" {...field} />
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
                      placeholder="4"
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
                Crear mesa
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
