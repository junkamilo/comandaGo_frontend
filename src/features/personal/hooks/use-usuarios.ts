"use client";

import { useQuery } from "@tanstack/react-query";

import { listarUsuarios } from "@/features/personal/api/usuarios.api";
import {
  filtroPersonalToParams,
  type FiltroPersonal,
} from "@/features/personal/constants/filtros-personal";
import type { ListarUsuariosParams } from "@/features/personal/types/usuario.types";

interface UseUsuariosOptions {
  filtro?: FiltroPersonal;
  page?: number;
  size?: number;
}

export function useUsuarios({ filtro = "todos", page = 0, size = 50 }: UseUsuariosOptions = {}) {
  const { activo, rol } = filtroPersonalToParams(filtro);

  const params: ListarUsuariosParams = {
    activo,
    rol,
    page,
    size,
  };

  const query = useQuery({
    queryKey: ["usuarios", params],
    queryFn: () => listarUsuarios(params),
  });

  return {
    usuarios: query.data?.content ?? [],
    totalElements: query.data?.totalElements ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
