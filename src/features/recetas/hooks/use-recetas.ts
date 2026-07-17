"use client";

import { useQuery } from "@tanstack/react-query";

import { listarRecetas } from "@/features/recetas/api/recetas.api";

export function useRecetas() {
  const query = useQuery({
    queryKey: ["recetas"],
    queryFn: listarRecetas,
  });

  return {
    recetas: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
