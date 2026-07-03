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
import { useResetPassword } from "@/features/personal/hooks/use-reset-password";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/features/personal/schemas/usuario.schemas";
import type { Usuario } from "@/features/personal/types/usuario.types";
import { applyFieldErrors } from "@/features/personal/utils/apply-field-errors";

const inputClassName = "h-11";

interface ResetPasswordDialogProps {
  usuario: Usuario | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResetPasswordDialog({ usuario, open, onOpenChange }: ResetPasswordDialogProps) {
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const {
    resetPassword,
    isPending,
    fieldErrors,
    reset: resetMutation,
  } = useResetPassword(() => {
    onOpenChange(false);
    form.reset();
    resetMutation();
  });

  useEffect(() => {
    if (!fieldErrors?.length) return;
    applyFieldErrors(fieldErrors, form.setError, ["password", "confirmPassword"]);
  }, [fieldErrors, form]);

  useEffect(() => {
    if (!open) {
      form.reset();
      resetMutation();
    }
  }, [open, form, resetMutation]);

  function onSubmit(values: ResetPasswordFormValues) {
    if (!usuario) return;
    resetMutation();
    form.clearErrors();
    resetPassword({ id: usuario.id, values });
  }

  if (!usuario) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[min(100vw-2rem,28rem)]">
        <DialogHeader>
          <DialogTitle>Restablecer contraseña</DialogTitle>
          <DialogDescription>
            Nueva contraseña para <strong>{usuario.nombre}</strong>.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nueva contraseña</FormLabel>
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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar contraseña</FormLabel>
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

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending} className="gap-2">
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Actualizar contraseña
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
