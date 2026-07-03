import type { Rol } from "@/features/auth/types/auth.types";
import { ROL_LABEL } from "@/features/navigation/modulos-data";

import { ROLES_STAFF, type RolStaff } from "./roles-staff";

export type FiltroPersonal = "todos" | "activos" | "inactivos" | RolStaff;

export const FILTROS_ESTADO: { value: FiltroPersonal; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "activos", label: "Activos" },
  { value: "inactivos", label: "Inactivos" },
];

export const FILTROS_ROL: { value: FiltroPersonal; label: string }[] = ROLES_STAFF.map((rol) => ({
  value: rol,
  label: ROL_LABEL[rol],
}));

export function filtroPersonalToParams(filtro: FiltroPersonal): {
  activo?: boolean;
  rol?: Rol;
} {
  if (filtro === "activos") return { activo: true };
  if (filtro === "inactivos") return { activo: false };
  if (filtro === "todos") return {};
  return { rol: filtro };
}
