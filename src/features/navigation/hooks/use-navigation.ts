"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import type { AuthResponse } from "@/features/auth/types/auth.types";
import type { Rol } from "@/features/auth/types/auth.types";
import { moduloActivo, modulosPorGrupoConIcono } from "@/features/navigation/modulos";
import { getSession } from "@/lib/auth-storage";

export function useNavigation() {
  const pathname = usePathname();
  const [session, setSession] = useState<AuthResponse | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSession(getSession());
    setMounted(true);
  }, []);

  const rol: Rol | null = session?.rol ?? null;

  const modulos = useMemo(
    () => (rol ? modulosPorGrupoConIcono(rol).flatMap((g) => g.modulos) : []),
    [rol],
  );
  const grupos = useMemo(() => (rol ? modulosPorGrupoConIcono(rol) : []), [rol]);
  const activo = useMemo(() => moduloActivo(pathname), [pathname]);

  return {
    session,
    mounted,
    rol,
    modulos,
    grupos: grupos,
    moduloActivo: activo,
  };
}
