"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { crearUsuario } from "@/features/personal/api/usuarios.api";
import type { CrearUsuarioFormValues } from "@/features/personal/schemas/usuario.schemas";
import { ApiError } from "@/lib/api-error";

function toRequest(values: CrearUsuarioFormValues) {
  return {
    nombre: values.nombre.trim(),
    email: values.email.trim(),
    password: values.password,
    telefono: values.telefono?.trim() || undefined,
    rol: values.rol,
  };
}

export function useCrearUsuario(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: CrearUsuarioFormValues) => crearUsuario(toRequest(values)),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast.success("Usuario creado", { description: data.nombre });
      onSuccess?.();
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && !error.fieldErrors?.length) {
        toast.error(error.message);
      }
    },
  });

  return {
    crearUsuario: mutation.mutate,
    isPending: mutation.isPending,
    fieldErrors: mutation.error instanceof ApiError ? mutation.error.fieldErrors : undefined,
    reset: mutation.reset,
  };
}
