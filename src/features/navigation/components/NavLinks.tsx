"use client";

import { usePathname } from "next/navigation";

import { NavItem } from "@/features/navigation/components/NavItem";
import type { Modulo } from "@/features/navigation/modulos";

interface NavLinksProps {
  modulos: Modulo[];
  grupos: { grupo: string; modulos: Modulo[] }[];
  onNavigate?: () => void;
}

export function NavLinks({ grupos, onNavigate }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-6">
      {grupos.map(({ grupo, modulos }) => (
        <div key={grupo}>
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {grupo}
          </p>
          <ul className="flex flex-col gap-1">
            {modulos.map((modulo) => {
              const activo =
                pathname === modulo.href ||
                (modulo.href !== "/" && pathname.startsWith(`${modulo.href}/`));

              return (
                <li key={modulo.id}>
                  <NavItem
                    href={modulo.href}
                    icon={modulo.icon}
                    label={modulo.label}
                    activo={activo}
                    onNavigate={onNavigate}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
