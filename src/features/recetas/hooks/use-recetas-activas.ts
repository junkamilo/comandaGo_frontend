"use client";

import { useQuery } from "@tanstack/react-query";

import { listarRecetasActivas } from "@/features/recetas/api/recetas.api";

export function useRecetasActivas(enabled = true) {
  const query = useQuery({
    queryKey: ["recetas", "activas"],
    queryFn: listarRecetasActivas,
    enabled,
  });

  return {
    recetas: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
