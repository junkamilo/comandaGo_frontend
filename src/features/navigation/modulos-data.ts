import type { Rol } from "@/features/auth/types/auth.types";

export type GrupoModulo = "Operación" | "Carta" | "Gestión";

export interface ModuloDefinition {
  id: string;
  label: string;
  href: string;
  grupo: GrupoModulo;
  roles: Rol[];
}

export const MODULO_DEFINITIONS: ModuloDefinition[] = [
  {
    id: "inicio",
    label: "Inicio",
    href: "/",
    grupo: "Operación",
    roles: ["ADMIN"],
  },
  {
    id: "pedidos",
    label: "Pedidos",
    href: "/pedidos",
    grupo: "Operación",
    roles: ["ADMIN", "MESERO", "CAJERO"],
  },
  {
    id: "cocina",
    label: "Cocina",
    href: "/cocina",
    grupo: "Operación",
    roles: ["ADMIN", "COCINERO"],
  },
  {
    id: "mesas",
    label: "Mesas",
    href: "/mesas",
    grupo: "Operación",
    roles: ["ADMIN", "MESERO"],
  },
  {
    id: "recepcion",
    label: "Recepción",
    href: "/recepcion",
    grupo: "Operación",
    roles: ["ADMIN", "RECEPCIONISTA"],
  },
  {
    id: "productos",
    label: "Productos",
    href: "/carta/productos",
    grupo: "Carta",
    roles: ["ADMIN"],
  },
  {
    id: "promociones",
    label: "Promociones",
    href: "/carta/promociones",
    grupo: "Carta",
    roles: ["ADMIN"],
  },
  {
    id: "categorias",
    label: "Categorías",
    href: "/carta/categorias",
    grupo: "Carta",
    roles: ["ADMIN"],
  },
  {
    id: "disponibilidad",
    label: "Menú del día",
    href: "/carta/disponibilidad",
    grupo: "Carta",
    roles: ["ADMIN", "MESERO"],
  },
  {
    id: "ventas",
    label: "Ventas",
    href: "/ventas",
    grupo: "Gestión",
    roles: ["ADMIN"],
  },
  {
    id: "caja",
    label: "Caja",
    href: "/caja",
    grupo: "Gestión",
    roles: ["ADMIN", "CAJERO"],
  },
  {
    id: "personal",
    label: "Personal",
    href: "/personal",
    grupo: "Gestión",
    roles: ["ADMIN"],
  },
  {
    id: "configuracion",
    label: "Configuración",
    href: "/configuracion",
    grupo: "Gestión",
    roles: ["ADMIN"],
  },
];

const GRUPO_ORDEN: GrupoModulo[] = ["Operación", "Carta", "Gestión"];

function normalizarPathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

export function modulosPara(rol: Rol): ModuloDefinition[] {
  return MODULO_DEFINITIONS.filter((m) => m.roles.includes(rol));
}

export function modulosPorGrupo(rol: Rol): { grupo: GrupoModulo; modulos: ModuloDefinition[] }[] {
  const filtrados = modulosPara(rol);
  return GRUPO_ORDEN.map((grupo) => ({
    grupo,
    modulos: filtrados.filter((m) => m.grupo === grupo),
  })).filter((g) => g.modulos.length > 0);
}

export function rutaInicialPorRol(rol: Rol): string {
  const modulos = modulosPara(rol);
  return modulos[0]?.href ?? "/login";
}

export function rutaPermitida(rol: Rol, pathname: string): boolean {
  const path = normalizarPathname(pathname);
  return modulosPara(rol).some(
    (m) => path === m.href || (m.href !== "/" && path.startsWith(`${m.href}/`)),
  );
}

export function moduloActivo(pathname: string): ModuloDefinition | undefined {
  const path = normalizarPathname(pathname);
  return [...MODULO_DEFINITIONS]
    .sort((a, b) => b.href.length - a.href.length)
    .find((m) => path === m.href || (m.href !== "/" && path.startsWith(`${m.href}/`)));
}

export const ROL_LABEL: Record<Rol, string> = {
  ADMIN: "Admin",
  MESERO: "Mesero",
  COCINERO: "Cocinero",
  RECEPCIONISTA: "Recepción",
  CAJERO: "Cajero",
};
