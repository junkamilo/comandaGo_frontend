"use client";

import { useQuery } from "@tanstack/react-query";

import { listarCierres } from "@/features/caja/api/caja.api";
import { CAJA_QUERY_KEYS } from "@/features/caja/hooks/caja-query-keys";

export function useCierresCaja(enabled = true) {
  return useQuery({
    queryKey: CAJA_QUERY_KEYS.cierres(),
    queryFn: listarCierres,
    enabled,
  });
}
