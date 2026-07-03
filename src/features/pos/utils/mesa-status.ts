import type { EstadoMesa } from "@/features/pos/types/pos.types";

export const estadoMesaLabel: Record<EstadoMesa, string> = {
  libre: "Libre",
  ocupada: "Ocupada",
  reservada: "Reservada",
};

export const estadoMesaClass: Record<EstadoMesa, string> = {
  libre: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  ocupada: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  reservada: "bg-blue-500/15 text-blue-400 border-blue-500/30",
};
