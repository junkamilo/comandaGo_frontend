"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AppShell } from "@/features/navigation/components/AppShell";
import { RoleGuard } from "@/features/navigation/components/RoleGuard";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const fullBleed = pathname === "/pedidos";

  return (
    <RoleGuard>
      <AppShell fullBleed={fullBleed}>{children}</AppShell>
    </RoleGuard>
  );
}
