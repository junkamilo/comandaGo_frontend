"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { agruparMesas } from "@/features/mesas/api/mesas.api";
import { invalidateMesasQueries } from "@/features/mesas/hooks/mesas-query-keys";
import { ApiError } from "@/lib/api-error";

export function useAgruparMesas(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (mesaIds: number[]) => agruparMesas({ mesaIds }),
    onSuccess: (data) => {
      invalidateMesasQueries(queryClient);
      toast.success("Mesas agrupadas", {
        description: data.map((m) => m.numero).join(" + "),
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    },
  });

  return {
    agruparMesas: mutation.mutate,
    isPending: mutation.isPending,
  };
}
