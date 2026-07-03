"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ROL_LABEL } from "@/features/navigation/modulos-data";
import type { AuthResponse } from "@/features/auth/types/auth.types";
import { clearSession } from "@/lib/auth-storage";

function iniciales(nombre: string): string {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

interface UserFooterProps {
  session: AuthResponse;
}

export function UserFooter({ session }: UserFooterProps) {
  const router = useRouter();

  function handleLogout() {
    clearSession();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="border-t border-border/60 p-3">
      <div className="flex items-center gap-3 rounded-lg px-2 py-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          {iniciales(session.nombre)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{session.nombre}</p>
          <p className="truncate text-xs text-muted-foreground">{ROL_LABEL[session.rol]}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={handleLogout}
          aria-label="Cerrar sesión"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
