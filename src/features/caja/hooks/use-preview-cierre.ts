"use client";

import { useQuery } from "@tanstack/react-query";

import { obtenerPreviewCierre } from "@/features/caja/api/caja.api";
import { CAJA_QUERY_KEYS } from "@/features/caja/hooks/caja-query-keys";

export function usePreviewCierre() {
  return useQuery({
    queryKey: CAJA_QUERY_KEYS.preview(),
    queryFn: obtenerPreviewCierre,
  });
}
