"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { resetearPassword } from "@/features/personal/api/usuarios.api";
import type { ResetPasswordFormValues } from "@/features/personal/schemas/usuario.schemas";
import { ApiError } from "@/lib/api-error";

interface ResetPayload {
  id: number;
  values: ResetPasswordFormValues;
}

export function useResetPassword(onSuccess?: () => void) {
  const mutation = useMutation({
    mutationFn: ({ id, values }: ResetPayload) => resetearPassword(id, values.password),
    onSuccess: () => {
      toast.success("Contraseña actualizada");
      onSuccess?.();
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && !error.fieldErrors?.length) {
        toast.error(error.message);
      }
    },
  });

  return {
    resetPassword: mutation.mutate,
    isPending: mutation.isPending,
    fieldErrors: mutation.error instanceof ApiError ? mutation.error.fieldErrors : undefined,
    reset: mutation.reset,
  };
}
