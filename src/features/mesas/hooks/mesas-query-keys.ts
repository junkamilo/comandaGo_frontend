export const MESAS_QUERY_KEYS = {
  list: ["mesas"] as const,
  piso: ["mesas-piso"] as const,
};

export function invalidateMesasQueries(
  queryClient: { invalidateQueries: (opts: { queryKey: readonly string[] }) => void },
) {
  queryClient.invalidateQueries({ queryKey: MESAS_QUERY_KEYS.list });
  queryClient.invalidateQueries({ queryKey: MESAS_QUERY_KEYS.piso });
}
