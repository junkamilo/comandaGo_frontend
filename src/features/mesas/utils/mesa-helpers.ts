import type { Mesa } from "@/features/mesas/types/mesa.types";

export function formatGrupoMesas(mesa: Mesa): string | null {
  const otras = mesa.mesasDelGrupo ?? [];
  if (!otras.length) return null;
  return [...otras].sort().join(" + ");
}

export function puedeAgruparse(mesa: Mesa): boolean {
  return mesa.activo && mesa.estado === "LIBRE" && !mesa.grupoId;
}

export function estaEnGrupo(mesa: Mesa): boolean {
  return mesa.grupoId != null && mesa.grupoId.length > 0;
}
