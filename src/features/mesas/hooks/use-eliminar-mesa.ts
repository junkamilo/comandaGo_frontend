"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { eliminarMesa } from "@/features/mesas/api/mesas.api";
import { invalidateMesasQueries } from "@/features/mesas/hooks/mesas-query-keys";
import { ApiError } from "@/lib/api-error";

export function useEliminarMesa(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => eliminarMesa(id),
    onSuccess: () => {
      invalidateMesasQueries(queryClient);
      toast.success("Mesa desactivada");
      onSuccess?.();
    },
    onError: (error: Error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    },
  });

  return {
    eliminarMesa: mutation.mutate,
    isPending: mutation.isPending,
  };
}
