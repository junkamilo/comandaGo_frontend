"use client";

import { useQuery } from "@tanstack/react-query";

import { listarPromociones } from "@/features/promociones/api/promociones.api";

export function usePromociones() {
  const query = useQuery({
    queryKey: ["promociones"],
    queryFn: listarPromociones,
  });

  return {
    promociones: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
