export const CAJA_QUERY_KEYS = {
  all: ["caja"] as const,
  preview: () => [...CAJA_QUERY_KEYS.all, "preview"] as const,
  cierres: () => [...CAJA_QUERY_KEYS.all, "cierres"] as const,
  cierre: (id: number) => [...CAJA_QUERY_KEYS.all, "cierre", id] as const,
};
