"use client";

import Link, { useLinkStatus } from "next/link";
import type { LucideIcon } from "lucide-react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  activo: boolean;
  onNavigate?: () => void;
}

function LinkSpinner() {
  const { pending } = useLinkStatus();

  return (
    <Loader2
      aria-hidden
      className={cn(
        "ml-auto h-4 w-4 shrink-0",
        pending ? "animate-spin opacity-100 [animation-delay:100ms]" : "opacity-0",
      )}
    />
  );
}

export function NavItem({ href, icon: Icon, label, activo, onNavigate }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        activo
          ? "bg-primary/15 text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0", activo && "text-primary")} />
      <span className="flex-1">{label}</span>
      <LinkSpinner />
    </Link>
  );
}
