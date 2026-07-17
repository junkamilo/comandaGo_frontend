"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { desactivarReceta } from "@/features/recetas/api/recetas.api";
import { ApiError } from "@/lib/api-error";

export function useDesactivarReceta(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => desactivarReceta(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recetas"] });
      toast.success("Receta desactivada");
      onSuccess?.();
    },
    onError: (error: Error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    },
  });

  return {
    desactivarReceta: mutation.mutate,
    isPending: mutation.isPending,
  };
}
