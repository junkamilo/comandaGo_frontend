"use client";

import { useState } from "react";
import { CalendarDays, Clock3 } from "lucide-react";

import { CalendarPickerModal } from "@/components/date-time/calendar-picker-modal";
import { TimePickerModal } from "@/components/date-time/time-picker-modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  formatLocalDateDisplay,
  formatLocalTimeDisplay,
  mergeLocalDateTime,
} from "@/lib/date-time-utils";

interface DateTimePickerFieldProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  datePlaceholder?: string;
  timePlaceholder?: string;
  calendarTitle?: string;
  calendarDescription?: string;
  timeTitle?: string;
  timeDescription?: string;
  minDate?: Date;
  maxDate?: Date;
}

export function DateTimePickerField({
  value,
  onChange,
  disabled,
  className,
  datePlaceholder = "Seleccionar fecha",
  timePlaceholder = "Seleccionar hora",
  calendarTitle,
  calendarDescription,
  timeTitle,
  timeDescription,
  minDate,
  maxDate,
}: DateTimePickerFieldProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  const dateLabel = formatLocalDateDisplay(value) || datePlaceholder;
  const timeLabel = formatLocalTimeDisplay(value) || timePlaceholder;
  const hasValue = Boolean(value);

  function handleDateConfirm(date: Date) {
    onChange(
      mergeLocalDateTime(value, {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      }),
    );
  }

  function handleTimeConfirm(hours: number, minutes: number) {
    onChange(mergeLocalDateTime(value, { hours, minutes }));
  }

  return (
    <>
      <div
        className={cn(
          "flex h-11 items-center overflow-hidden rounded-md border border-input bg-background shadow-xs",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        <button
          type="button"
          disabled={disabled}
          onClick={() => setCalendarOpen(true)}
          className={cn(
            "flex h-full min-w-0 flex-1 items-center gap-2 px-3 text-left text-sm transition-colors",
            "hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            !hasValue && "text-muted-foreground",
          )}
        >
          <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate">{dateLabel}</span>
        </button>

        <div className="h-6 w-px bg-border/80" aria-hidden />

        <button
          type="button"
          disabled={disabled}
          onClick={() => setTimeOpen(true)}
          className={cn(
            "flex h-full min-w-0 flex-1 items-center gap-2 px-3 text-left text-sm transition-colors",
            "hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            !hasValue && "text-muted-foreground",
          )}
        >
          <Clock3 className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate">{timeLabel}</span>
        </button>
      </div>

      <CalendarPickerModal
        open={calendarOpen}
        onOpenChange={setCalendarOpen}
        value={value}
        onConfirm={handleDateConfirm}
        title={calendarTitle}
        description={calendarDescription}
        minDate={minDate}
        maxDate={maxDate}
      />

      <TimePickerModal
        open={timeOpen}
        onOpenChange={setTimeOpen}
        value={value}
        onConfirm={handleTimeConfirm}
        title={timeTitle}
        description={timeDescription}
      />
    </>
  );
}

interface DateTimePickerClearButtonProps {
  visible: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function DateTimePickerClearButton({
  visible,
  onClick,
  disabled,
}: DateTimePickerClearButtonProps) {
  if (!visible) return null;

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-8 px-2 text-xs text-muted-foreground"
      disabled={disabled}
      onClick={onClick}
    >
      Limpiar
    </Button>
  );
}
