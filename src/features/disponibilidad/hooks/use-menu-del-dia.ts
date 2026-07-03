"use client";

import { useQuery } from "@tanstack/react-query";

import { obtenerMenuDelDia } from "@/features/productos/api/productos.api";

export function useMenuDelDia() {
  const query = useQuery({
    queryKey: ["menu-del-dia"],
    queryFn: obtenerMenuDelDia,
  });

  return {
    productos: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
