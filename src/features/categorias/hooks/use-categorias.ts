"use client";

import { useQuery } from "@tanstack/react-query";

import { listarTodasCategorias } from "@/features/categorias/api/categorias.api";

export function useCategorias() {
  const query = useQuery({
    queryKey: ["categorias"],
    queryFn: listarTodasCategorias,
  });

  return {
    categorias: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
