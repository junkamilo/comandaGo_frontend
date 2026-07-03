import type { Rol } from "@/features/auth/types/auth.types";

export const ROLES_STAFF = [
  "MESERO",
  "COCINERO",
  "CAJERO",
  "RECEPCIONISTA",
] as const satisfies readonly Rol[];

export type RolStaff = (typeof ROLES_STAFF)[number];
