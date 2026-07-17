"use client";

import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
}

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  /** Centra el bloque en el espacio disponible del módulo */
  centered?: boolean;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  centered = false,
  className,
}: EmptyStateProps) {
  const ActionIcon = action?.icon;

  const content = (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-dashed border-border/70 bg-card/40 px-6 py-12 text-center",
        "transition-colors hover:border-primary/30 hover:bg-card/60",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"
      />

      <div className="relative mx-auto flex max-w-sm flex-col items-center gap-4">
        <div className="relative">
          <div
            aria-hidden
            className="absolute inset-0 scale-150 rounded-full bg-primary/10 blur-2xl"
          />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 shadow-inner">
            <Icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          {description && (
            <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
          )}
        </div>

        {action && (
          <Button className="mt-1 h-11 gap-2 px-6" onClick={action.onClick}>
            {ActionIcon && <ActionIcon className="h-4 w-4" />}
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );

  if (!centered) {
    return content;
  }

  return (
    <div className="flex w-full items-center justify-center px-2 py-12 md:py-16">
      <div className="w-full max-w-lg">{content}</div>
    </div>
  );
}
