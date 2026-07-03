"use client";

import type { ReactNode } from "react";

import { AppHeader } from "@/features/navigation/components/AppHeader";
import { AppSidebar } from "@/features/navigation/components/AppSidebar";

interface AppShellProps {
  children: ReactNode;
  headerAction?: ReactNode;
  fullBleed?: boolean;
}

export function AppShell({ children, headerAction, fullBleed = false }: AppShellProps) {
  return (
    <div className="flex h-dvh max-h-dvh overflow-hidden bg-background supports-[min-height:100dvh]:h-dvh supports-[min-height:100dvh]:max-h-dvh">
      <AppSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <AppHeader>{headerAction}</AppHeader>
        <main
          className={
            fullBleed
              ? "min-h-0 flex-1 overflow-hidden"
              : "min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6"
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
}
