const LOCAL_DATETIME_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export interface LocalDateTimeParts {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
}

export function isValidLocalDateTime(value: string | undefined | null): value is string {
  return Boolean(value && LOCAL_DATETIME_PATTERN.test(value));
}

export function parseLocalDateTime(value: string | undefined | null): LocalDateTimeParts | null {
  if (!isValidLocalDateTime(value)) return null;

  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);

  return { year, month, day, hours, minutes };
}

export function toLocalDate(value: string | undefined | null): Date | undefined {
  const parts = parseLocalDateTime(value);
  if (!parts) return undefined;
  return new Date(parts.year, parts.month - 1, parts.day, parts.hours, parts.minutes, 0, 0);
}

export function buildLocalDateTime(parts: LocalDateTimeParts): string {
  const year = String(parts.year).padStart(4, "0");
  const month = String(parts.month).padStart(2, "0");
  const day = String(parts.day).padStart(2, "0");
  const hours = String(parts.hours).padStart(2, "0");
  const minutes = String(parts.minutes).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function mergeLocalDateTime(
  currentValue: string | undefined | null,
  updates: Partial<LocalDateTimeParts>,
): string {
  const now = new Date();
  const base = parseLocalDateTime(currentValue) ?? {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    hours: now.getHours(),
    minutes: now.getMinutes(),
  };

  return buildLocalDateTime({ ...base, ...updates });
}

export function formatLocalDateDisplay(value: string | undefined | null): string {
  const date = toLocalDate(value);
  if (!date) return "";
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatLocalTimeDisplay(value: string | undefined | null): string {
  const date = toLocalDate(value);
  if (!date) return "";
  return new Intl.DateTimeFormat("es-CO", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatLocalDateTimeDisplay(value: string | undefined | null): string {
  const datePart = formatLocalDateDisplay(value);
  const timePart = formatLocalTimeDisplay(value);
  if (!datePart && !timePart) return "";
  if (!timePart) return datePart;
  if (!datePart) return timePart;
  return `${datePart} ${timePart}`;
}

export function toIsoDateTime(localValue: string): string {
  return new Date(localValue).toISOString();
}

export function fromIsoToLocalInput(iso: string): string {
  const date = new Date(iso);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export function defaultNowLocalDateTime(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export function to12Hour(hours24: number): { hour12: number; period: "AM" | "PM" } {
  const period = hours24 >= 12 ? "PM" : "AM";
  const hour12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return { hour12, period };
}

export function to24Hour(hour12: number, period: "AM" | "PM"): number {
  if (period === "AM") return hour12 === 12 ? 0 : hour12;
  return hour12 === 12 ? 12 : hour12 + 12;
}
