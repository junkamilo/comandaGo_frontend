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
import { RolStaffSelect } from "@/features/personal/components/RolStaffSelect";
import { useCrearUsuario } from "@/features/personal/hooks/use-crear-usuario";
import {
  crearUsuarioSchema,
  type CrearUsuarioFormValues,
} from "@/features/personal/schemas/usuario.schemas";
import { applyFieldErrors } from "@/features/personal/utils/apply-field-errors";
import type { RolStaff } from "@/features/personal/constants/roles-staff";

const inputClassName = "h-11";

interface NuevoUsuarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultValues: CrearUsuarioFormValues = {
  nombre: "",
  email: "",
  password: "",
  telefono: "",
  rol: "MESERO",
};

export function NuevoUsuarioDialog({ open, onOpenChange }: NuevoUsuarioDialogProps) {
  const form = useForm<CrearUsuarioFormValues>({
    resolver: zodResolver(crearUsuarioSchema),
    defaultValues,
  });

  const {
    crearUsuario,
    isPending,
    fieldErrors,
    reset: resetMutation,
  } = useCrearUsuario(() => {
    onOpenChange(false);
    form.reset(defaultValues);
    resetMutation();
  });

  useEffect(() => {
    if (!fieldErrors?.length) return;
    applyFieldErrors(fieldErrors, form.setError, [
      "nombre",
      "email",
      "password",
      "telefono",
      "rol",
    ]);
  }, [fieldErrors, form]);

  useEffect(() => {
    if (!open) {
      form.reset(defaultValues);
      resetMutation();
    }
  }, [open, form, resetMutation]);

  function onSubmit(values: CrearUsuarioFormValues) {
    resetMutation();
    form.clearErrors();
    crearUsuario(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-[min(100vw-2rem,28rem)]">
        <DialogHeader>
          <DialogTitle>Nuevo usuario</DialogTitle>
          <DialogDescription>
            Crea personal operativo: mesero, cocinero, cajero o recepción.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input className={inputClassName} autoComplete="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input className={inputClassName} type="email" autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      className={inputClassName}
                      type="password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono (opcional)</FormLabel>
                  <FormControl>
                    <Input className={inputClassName} type="tel" autoComplete="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <FormControl>
                    <RolStaffSelect
                      value={field.value as RolStaff}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending} className="gap-2">
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Crear usuario
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
