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
    <div className="flex min-h-[100dvh] bg-background supports-[min-height:100dvh]:min-h-dvh">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader>{headerAction}</AppHeader>
        <main
          className={
            fullBleed
              ? "min-h-0 flex-1 overflow-hidden"
              : "flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6"
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
}
