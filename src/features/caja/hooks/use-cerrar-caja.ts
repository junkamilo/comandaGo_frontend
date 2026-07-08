"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { cerrarCaja } from "@/features/caja/api/caja.api";
import { CAJA_QUERY_KEYS } from "@/features/caja/hooks/caja-query-keys";
import type { CerrarCajaRequest } from "@/features/caja/types/caja.types";
import { ApiError } from "@/lib/api-error";
import { formatCOP } from "@/lib/format-cop";

export function useCerrarCaja() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (body: CerrarCajaRequest) => cerrarCaja(body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CAJA_QUERY_KEYS.preview() });
      queryClient.invalidateQueries({ queryKey: CAJA_QUERY_KEYS.cierres() });
      const diffMsg =
        data.diferencia != null && data.diferencia !== 0
          ? ` · Diferencia: ${formatCOP(data.diferencia)}`
          : "";
      toast.success("Caja cerrada", {
        description: `Total turno: ${formatCOP(data.totalGeneral)}${diffMsg}`,
      });
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && !error.fieldErrors?.length) {
        toast.error(error.message);
      }
    },
  });

  return {
    cerrarCajaAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}
