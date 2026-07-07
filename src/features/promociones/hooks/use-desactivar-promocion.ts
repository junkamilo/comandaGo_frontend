"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { desactivarPromocion } from "@/features/promociones/api/promociones.api";
import { ApiError } from "@/lib/api-error";

export function useDesactivarPromocion(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => desactivarPromocion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promociones"] });
      toast.success("Promoción desactivada");
      onSuccess?.();
    },
    onError: (error: Error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    },
  });

  return {
    desactivarPromocion: mutation.mutate,
    isPending: mutation.isPending,
  };
}
