"use client";

import { useQuery } from "@tanstack/react-query";

import { listarMesas } from "@/features/mesas/api/mesas.api";
import type { EstadoMesa, ListarMesasParams } from "@/features/mesas/types/mesa.types";

export type FiltroEstadoMesa = "todas" | EstadoMesa;

export function filtroEstadoToParam(filtro: FiltroEstadoMesa): EstadoMesa | undefined {
  if (filtro === "todas") return undefined;
  return filtro;
}

interface UseMesasOptions {
  filtroEstado?: FiltroEstadoMesa;
  activo?: boolean;
  page?: number;
  size?: number;
}

export function useMesas({
  filtroEstado = "todas",
  activo = true,
  page = 0,
  size = 50,
}: UseMesasOptions = {}) {
  const params: ListarMesasParams = {
    estado: filtroEstadoToParam(filtroEstado),
    activo,
    page,
    size,
  };

  const query = useQuery({
    queryKey: ["mesas", params],
    queryFn: () => listarMesas(params),
  });

  return {
    mesas: query.data?.content ?? [],
    totalElements: query.data?.totalElements ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
