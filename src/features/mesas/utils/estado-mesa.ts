import type { EstadoMesa } from "@/features/mesas/types/mesa.types";

export const estadoMesaLabel: Record<EstadoMesa, string> = {
  LIBRE: "Libre",
  OCUPADA: "Ocupada",
  RESERVADA: "Reservada",
  INACTIVA: "Inactiva",
};

export const estadoMesaClass: Record<EstadoMesa, string> = {
  LIBRE: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  OCUPADA: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  RESERVADA: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  INACTIVA: "bg-muted text-muted-foreground border-border/60",
};
