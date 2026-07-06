"use client";

import { useQuery } from "@tanstack/react-query";

import { listarMenuCategorias } from "@/features/categorias/api/categorias.api";

export function useCategoriasMenu() {
  const query = useQuery({
    queryKey: ["categorias", "menu"],
    queryFn: listarMenuCategorias,
  });

  return {
    categorias: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
