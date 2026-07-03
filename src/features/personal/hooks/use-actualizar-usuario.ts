"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { actualizarUsuario } from "@/features/personal/api/usuarios.api";
import type { EditarUsuarioFormValues } from "@/features/personal/schemas/usuario.schemas";
import type { ActualizarUsuarioRequest } from "@/features/personal/types/usuario.types";
import { ApiError } from "@/lib/api-error";

interface ActualizarPayload {
  id: number;
  values: EditarUsuarioFormValues;
  includeRol?: boolean;
}

function toRequest(values: EditarUsuarioFormValues, includeRol = true): ActualizarUsuarioRequest {
  const body: ActualizarUsuarioRequest = {
    nombre: values.nombre.trim(),
    email: values.email.trim(),
    telefono: values.telefono?.trim() || undefined,
  };
  if (includeRol && values.rol) {
    body.rol = values.rol;
  }
  return body;
}

export function useActualizarUsuario(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, values, includeRol = true }: ActualizarPayload) =>
      actualizarUsuario(id, toRequest(values, includeRol)),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast.success("Usuario actualizado", { description: data.nombre });
      onSuccess?.();
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && !error.fieldErrors?.length) {
        toast.error(error.message);
      }
    },
  });

  return {
    actualizarUsuario: mutation.mutate,
    isPending: mutation.isPending,
    fieldErrors: mutation.error instanceof ApiError ? mutation.error.fieldErrors : undefined,
    reset: mutation.reset,
  };
}
