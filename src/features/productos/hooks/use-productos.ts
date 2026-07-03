"use client";

import { useQuery } from "@tanstack/react-query";

import { listarProductos } from "@/features/productos/api/productos.api";
import type { ListarProductosParams } from "@/features/productos/types/producto.types";

interface UseProductosOptions {
  categoriaId?: number;
  activo?: boolean;
  disponible?: boolean;
  esPromocion?: boolean;
  page?: number;
  size?: number;
}

export function useProductos({
  categoriaId,
  activo,
  disponible,
  esPromocion,
  page = 0,
  size = 100,
}: UseProductosOptions = {}) {
  const params: ListarProductosParams = {
    categoriaId,
    activo,
    disponible,
    esPromocion,
    page,
    size,
  };

  const query = useQuery({
    queryKey: ["productos", params],
    queryFn: () => listarProductos(params),
  });

  return {
    productos: query.data?.content ?? [],
    totalElements: query.data?.totalElements ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
