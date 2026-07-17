"use client";

import { useState } from "react";
import { Clock3 } from "lucide-react";

import { TimePickerModal } from "@/components/date-time/time-picker-modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buildLocalDateTime } from "@/lib/date-time-utils";

interface DurationPickerFieldProps {
  value?: number | null;
  onChange: (minutes: number | null) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  title?: string;
  description?: string;
  clearable?: boolean;
}

export function DurationPickerField({
  value,
  onChange,
  disabled,
  className,
  placeholder = "Seleccionar tiempo",
  title = "Tiempo de preparación",
  description = "Elige horas y minutos.",
  clearable = true,
}: DurationPickerFieldProps) {
  const [open, setOpen] = useState(false);
  const hasValue = value != null && !Number.isNaN(value);
  const label = hasValue ? formatDurationMinutes(value) : placeholder;

  function handleConfirm(hours: number, minutes: number) {
    onChange(hours * 60 + minutes);
  }

  return (
    <>
      <div className={cn("flex items-center gap-2", className)}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(true)}
          className={cn(
            "flex h-11 min-w-0 flex-1 items-center gap-2 rounded-md border border-input bg-background px-3 text-left text-sm shadow-xs transition-colors",
            "hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            disabled && "cursor-not-allowed opacity-50",
            !hasValue && "text-muted-foreground",
          )}
        >
          <Clock3 className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate">{label}</span>
        </button>

        {clearable && hasValue && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 shrink-0 px-2 text-xs text-muted-foreground"
            disabled={disabled}
            onClick={() => onChange(null)}
          >
            Limpiar
          </Button>
        )}
      </div>

      <TimePickerModal
        open={open}
        onOpenChange={setOpen}
        mode="duration"
        value={minutesToPickerValue(value)}
        onConfirm={handleConfirm}
        title={title}
        description={description}
      />
    </>
  );
}

export function formatDurationMinutes(totalMinutes: number): string {
  const safe = Math.max(0, Math.floor(totalMinutes));
  const hours = Math.floor(safe / 60);
  const minutes = safe % 60;

  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} h`;
  return `${hours} h ${minutes} min`;
}

function minutesToPickerValue(totalMinutes: number | null | undefined): string {
  const now = new Date();
  const safe = Math.max(0, Math.floor(totalMinutes ?? 0));
  return buildLocalDateTime({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    hours: Math.floor(safe / 60) % 24,
    minutes: safe % 60,
  });
}
