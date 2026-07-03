"use client";

import { useQuery } from "@tanstack/react-query";

import { listarMesasPiso } from "@/features/mesas/api/mesas.api";
import { MESAS_QUERY_KEYS } from "@/features/mesas/hooks/mesas-query-keys";

export function useMesasPiso() {
  const query = useQuery({
    queryKey: MESAS_QUERY_KEYS.piso,
    queryFn: listarMesasPiso,
  });

  return {
    mesas: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
