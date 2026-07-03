export const PEDIDOS_QUERY_KEYS = {
  cocina: ["pedidos-cocina"] as const,
  activos: ["pedidos-activos"] as const,
  porMesa: (mesaId: number) => ["pedidos-mesa", mesaId] as const,
};

export function invalidatePedidosQueries(queryClient: {
  invalidateQueries: (opts: { queryKey: readonly unknown[] }) => void;
}) {
  queryClient.invalidateQueries({ queryKey: PEDIDOS_QUERY_KEYS.cocina });
  queryClient.invalidateQueries({ queryKey: PEDIDOS_QUERY_KEYS.activos });
}
