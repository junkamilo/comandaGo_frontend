"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { login as loginApi } from "@/features/auth/api/auth.api";
import { rutaInicialPorRol } from "@/features/navigation/modulos-data";
import type { LoginFormValues } from "@/features/auth/schemas/login.schema";
import { ApiError } from "@/lib/api-error";
import { setSession } from "@/lib/auth-storage";

export function useLogin() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (values: LoginFormValues) => loginApi(values),
    onSuccess: (data) => {
      setSession(data);
      toast.success("Bienvenido", {
        description: `Hola, ${data.nombre}`,
      });
      router.push(rutaInicialPorRol(data.rol));
      router.refresh();
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && !error.fieldErrors?.length) {
        toast.error(error.message);
      }
    },
  });

  return {
    login: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
    fieldErrors: mutation.error instanceof ApiError ? mutation.error.fieldErrors : undefined,
    reset: mutation.reset,
  };
}
