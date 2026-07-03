"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { desagruparMesas } from "@/features/mesas/api/mesas.api";
import { invalidateMesasQueries } from "@/features/mesas/hooks/mesas-query-keys";
import { ApiError } from "@/lib/api-error";

export function useDesagruparMesas(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (grupoId: string) => desagruparMesas(grupoId),
    onSuccess: () => {
      invalidateMesasQueries(queryClient);
      toast.success("Mesas separadas");
      onSuccess?.();
    },
    onError: (error: Error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    },
  });

  return {
    desagruparMesas: mutation.mutate,
    isPending: mutation.isPending,
  };
}
