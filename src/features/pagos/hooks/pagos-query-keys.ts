export const PAGOS_QUERY_KEYS = {
  resumen: (pedidoId: number) => ["pagos-resumen", pedidoId] as const,
};
