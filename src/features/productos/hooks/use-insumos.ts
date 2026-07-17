"use client";

import { useQuery } from "@tanstack/react-query";

import { listarInsumos } from "@/features/productos/api/productos.api";

export function useInsumos(enabled = true) {
  const query = useQuery({
    queryKey: ["productos", "insumos"],
    queryFn: listarInsumos,
    enabled,
  });

  return {
    insumos: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
