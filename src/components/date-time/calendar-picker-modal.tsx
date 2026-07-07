"use client";

import { useEffect, useState } from "react";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toLocalDate } from "@/lib/date-time-utils";

interface CalendarPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value?: string;
  onConfirm: (date: Date) => void;
  title?: string;
  description?: string;
  minDate?: Date;
  maxDate?: Date;
}

export function CalendarPickerModal({
  open,
  onOpenChange,
  value,
  onConfirm,
  title = "Seleccionar fecha",
  description = "Elige el día para esta fecha.",
  minDate,
  maxDate,
}: CalendarPickerModalProps) {
  const [selected, setSelected] = useState<Date | undefined>(() => toLocalDate(value));

  useEffect(() => {
    if (!open) return;
    setSelected(toLocalDate(value) ?? new Date());
  }, [open, value]);

  function handleConfirm() {
    if (!selected) return;
    onConfirm(selected);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-4 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex justify-center rounded-xl border border-border/60 bg-card/40 p-2">
          <Calendar
            mode="single"
            locale={es}
            selected={selected}
            onSelect={setSelected}
            defaultMonth={selected}
            disabled={(date) => {
              if (minDate && date < stripTime(minDate)) return true;
              if (maxDate && date > stripTime(maxDate)) return true;
              return false;
            }}
            captionLayout="dropdown"
            className="rounded-lg"
          />
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
          <Button type="button" className="h-11" disabled={!selected} onClick={handleConfirm}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function stripTime(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
