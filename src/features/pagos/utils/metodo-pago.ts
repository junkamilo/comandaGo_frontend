import type { MetodoPago } from "@/features/pagos/types/pago.types";

export const metodoPagoLabel: Record<MetodoPago, string> = {
  EFECTIVO: "Efectivo",
  TARJETA: "Tarjeta",
  TRANSFERENCIA: "Transferencia",
  NEQUI: "Nequi",
  DAVIPLATA: "Daviplata",
  PSE: "PSE",
  OTRO: "Otro",
};

export const metodosPagoDisponibles: MetodoPago[] = [
  "EFECTIVO",
  "TARJETA",
  "TRANSFERENCIA",
  "NEQUI",
  "DAVIPLATA",
  "PSE",
  "OTRO",
];
