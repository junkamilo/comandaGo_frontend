"use client";

import type { ReactNode } from "react";

import { MobileNav } from "@/features/navigation/components/MobileNav";
import { useNavigation } from "@/features/navigation/hooks/use-navigation";

interface AppHeaderProps {
  children?: ReactNode;
}

export function AppHeader({ children }: AppHeaderProps) {
  const { moduloActivo } = useNavigation();

  return (
    <header className="sticky top-0 z-20 flex shrink-0 items-center gap-3 border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-6">
      <MobileNav />
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-semibold tracking-tight">
          {moduloActivo?.label ?? "ComandaGo"}
        </h1>
      </div>
      {children}
    </header>
  );
}
