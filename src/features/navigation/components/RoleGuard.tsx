"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import type { Rol } from "@/features/auth/types/auth.types";
import { rutaInicialPorRol, rutaPermitida } from "@/features/navigation/modulos-data";
import { getSession } from "@/lib/auth-storage";

interface RoleGuardProps {
  children: ReactNode;
}

export function RoleGuard({ children }: RoleGuardProps) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/login");
      return;
    }

    const rol = session.rol as Rol;
    if (!rutaPermitida(rol, pathname)) {
      router.replace(rutaInicialPorRol(rol));
    }
  }, [pathname, router]);

  return <>{children}</>;
}
