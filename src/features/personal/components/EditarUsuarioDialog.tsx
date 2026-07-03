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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RolStaffSelect } from "@/features/personal/components/RolStaffSelect";
import type { RolStaff } from "@/features/personal/constants/roles-staff";
import { ROLES_STAFF } from "@/features/personal/constants/roles-staff";
import { useActualizarUsuario } from "@/features/personal/hooks/use-actualizar-usuario";
import { useDesactivarUsuario } from "@/features/personal/hooks/use-desactivar-usuario";
import {
  editarUsuarioSchema,
  type EditarUsuarioFormValues,
} from "@/features/personal/schemas/usuario.schemas";
import type { Usuario } from "@/features/personal/types/usuario.types";
import { applyFieldErrors } from "@/features/personal/utils/apply-field-errors";
import { getSession } from "@/lib/auth-storage";

const inputClassName = "h-11";

interface EditarUsuarioDialogProps {
  usuario: Usuario | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function isStaffRol(rol: Usuario["rol"]): rol is RolStaff {
  return (ROLES_STAFF as readonly string[]).includes(rol);
}

export function EditarUsuarioDialog({ usuario, open, onOpenChange }: EditarUsuarioDialogProps) {
  const session = getSession();
  const isSelf = session?.id === usuario?.id;

  const form = useForm<EditarUsuarioFormValues>({
    resolver: zodResolver(editarUsuarioSchema),
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
      rol: "MESERO",
    },
  });

  const {
    actualizarUsuario,
    isPending,
    fieldErrors,
    reset: resetMutation,
  } = useActualizarUsuario(() => {
    onOpenChange(false);
    resetMutation();
  });

  const { toggleActivo, isTogglingActivo } = useDesactivarUsuario(() => onOpenChange(false));

  useEffect(() => {
    if (!usuario || !open) return;
    form.reset({
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono ?? "",
      rol: isStaffRol(usuario.rol) ? usuario.rol : "MESERO",
    });
  }, [usuario, open, form]);

  useEffect(() => {
    if (!fieldErrors?.length) return;
    applyFieldErrors(fieldErrors, form.setError, ["nombre", "email", "telefono", "rol"]);
  }, [fieldErrors, form]);

  function onSubmit(values: EditarUsuarioFormValues) {
    if (!usuario) return;
    resetMutation();
    form.clearErrors();
    actualizarUsuario({ id: usuario.id, values, includeRol: staff });
  }

  function handleActivoChange(checked: boolean) {
    if (!usuario || isSelf) return;
    toggleActivo({ id: usuario.id, activo: checked });
  }

  if (!usuario) return null;

  const staff = isStaffRol(usuario.rol);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-[min(100vw-2rem,28rem)]">
        <DialogHeader>
          <DialogTitle>Editar usuario</DialogTitle>
          <DialogDescription>Actualiza los datos de {usuario.nombre}.</DialogDescription>
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
                    <Input className={inputClassName} {...field} />
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
                    <Input className={inputClassName} type="email" {...field} />
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
                    <Input className={inputClassName} type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {staff && (
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
            )}

            {!isSelf && (
              <div className="flex min-h-11 items-center justify-between rounded-lg border border-border/60 px-3">
                <Label htmlFor="activo-switch" className="cursor-pointer">
                  Usuario activo
                </Label>
                <Switch
                  id="activo-switch"
                  checked={usuario.activo}
                  disabled={isTogglingActivo}
                  onCheckedChange={handleActivoChange}
                />
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending} className="gap-2">
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
