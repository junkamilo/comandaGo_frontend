"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  formatLocalTimeDisplay,
  parseLocalDateTime,
  to12Hour,
  to24Hour,
} from "@/lib/date-time-utils";

interface TimePickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value?: string;
  onConfirm: (hours: number, minutes: number) => void;
  title?: string;
  description?: string;
}

const HOURS_12 = Array.from({ length: 12 }, (_, index) => index + 1);
const MINUTES = Array.from({ length: 60 }, (_, index) => index);

export function TimePickerModal({
  open,
  onOpenChange,
  value,
  onConfirm,
  title = "Seleccionar hora",
  description = "Elige la hora para esta fecha.",
}: TimePickerModalProps) {
  const initial = useMemo(() => getInitialTime(value), [value]);
  const [hour12, setHour12] = useState(initial.hour12);
  const [minutes, setMinutes] = useState(initial.minutes);
  const [period, setPeriod] = useState<"AM" | "PM">(initial.period);

  useEffect(() => {
    if (!open) return;
    const next = getInitialTime(value);
    setHour12(next.hour12);
    setMinutes(next.minutes);
    setPeriod(next.period);
  }, [open, value]);

  const preview = formatLocalTimeDisplay(
    buildPreviewValue(value, to24Hour(hour12, period), minutes),
  );

  function handleConfirm() {
    onConfirm(to24Hour(hour12, period), minutes);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-4 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-border/60 bg-card/40 p-4">
          <p className="mb-4 text-center text-3xl font-semibold tracking-tight">{preview}</p>

          <div className="grid grid-cols-3 gap-3">
            <TimeColumn label="Hora" testId="hour">
              {HOURS_12.map((hour) => (
                <TimeOption key={hour} selected={hour12 === hour} onClick={() => setHour12(hour)}>
                  {String(hour).padStart(2, "0")}
                </TimeOption>
              ))}
            </TimeColumn>

            <TimeColumn label="Minutos" testId="minute">
              {MINUTES.map((minute) => (
                <TimeOption
                  key={minute}
                  selected={minutes === minute}
                  onClick={() => setMinutes(minute)}
                >
                  {String(minute).padStart(2, "0")}
                </TimeOption>
              ))}
            </TimeColumn>

            <div className="space-y-2">
              <p className="text-center text-xs font-medium text-muted-foreground">Periodo</p>
              <div className="flex flex-col gap-2">
                <PeriodButton selected={period === "AM"} onClick={() => setPeriod("AM")}>
                  a. m.
                </PeriodButton>
                <PeriodButton selected={period === "PM"} onClick={() => setPeriod("PM")}>
                  p. m.
                </PeriodButton>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            className="h-11"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type="button" className="h-11" onClick={handleConfirm}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TimeColumn({
  label,
  testId,
  children,
}: {
  label: string;
  testId: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-center text-xs font-medium text-muted-foreground">{label}</p>
      <ScrollArea className="h-44 rounded-lg border border-border/60" data-testid={testId}>
        <div className="grid grid-cols-1 gap-1 p-2">{children}</div>
      </ScrollArea>
    </div>
  );
}

function TimeOption({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 rounded-md text-sm font-medium transition-colors",
        selected
          ? "bg-primary text-primary-foreground"
          : "text-foreground hover:bg-accent hover:text-accent-foreground",
      )}
    >
      {children}
    </button>
  );
}

function PeriodButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-11 rounded-md border text-sm font-medium transition-colors",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border/60 bg-background hover:bg-accent hover:text-accent-foreground",
      )}
    >
      {children}
    </button>
  );
}

function getInitialTime(value?: string) {
  const parts = parseLocalDateTime(value);
  if (!parts) {
    const now = new Date();
    return { ...to12Hour(now.getHours()), minutes: now.getMinutes() };
  }
  return { ...to12Hour(parts.hours), minutes: parts.minutes };
}

function buildPreviewValue(value: string | undefined, hours: number, minutes: number) {
  const parts = parseLocalDateTime(value);
  const now = new Date();
  const year = parts?.year ?? now.getFullYear();
  const month = parts?.month ?? now.getMonth() + 1;
  const day = parts?.day ?? now.getDate();
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${hh}:${mm}`;
}
