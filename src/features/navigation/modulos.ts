import type { LucideIcon } from "lucide-react";
import {
  CalendarCheck,
  ChefHat,
  ClipboardList,
  ConciergeBell,
  FolderTree,
  LayoutDashboard,
  LayoutGrid,
  Settings,
  TrendingUp,
  Users,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";

import type { Rol } from "@/features/auth/types/auth.types";
import {
  MODULO_DEFINITIONS,
  moduloActivo,
  modulosPara,
  modulosPorGrupo,
  ROL_LABEL,
  rutaInicialPorRol,
  rutaPermitida,
  type GrupoModulo,
  type ModuloDefinition,
} from "@/features/navigation/modulos-data";

const ICONS: Record<string, LucideIcon> = {
  inicio: LayoutDashboard,
  pedidos: ClipboardList,
  cocina: ChefHat,
  mesas: LayoutGrid,
  recepcion: ConciergeBell,
  productos: UtensilsCrossed,
  categorias: FolderTree,
  disponibilidad: CalendarCheck,
  ventas: TrendingUp,
  caja: Wallet,
  personal: Users,
  configuracion: Settings,
};

export interface Modulo extends ModuloDefinition {
  icon: LucideIcon;
}

export const MODULOS: Modulo[] = MODULO_DEFINITIONS.map((m) => ({
  ...m,
  icon: ICONS[m.id],
}));

export {
  moduloActivo,
  modulosPara,
  modulosPorGrupo,
  ROL_LABEL,
  rutaInicialPorRol,
  rutaPermitida,
  type GrupoModulo,
};

export function modulosConIcono(rol: Rol): Modulo[] {
  return modulosPara(rol).map((m) => ({ ...m, icon: ICONS[m.id] }));
}

export function modulosPorGrupoConIcono(rol: Rol): { grupo: GrupoModulo; modulos: Modulo[] }[] {
  return modulosPorGrupo(rol).map((g) => ({
    grupo: g.grupo,
    modulos: g.modulos.map((m) => ({ ...m, icon: ICONS[m.id] })),
  }));
}
