import { TIPO_PROMOCION_LABEL } from "@/features/promociones/constants/tipo-promocion";
import type { Promocion, TipoPromocion } from "@/features/promociones/types/promocion.types";
import { defaultNowLocalDateTime, fromIsoToLocalInput, toIsoDateTime } from "@/lib/date-time-utils";
import { formatCOP } from "@/lib/format-cop";

export { defaultNowLocalDateTime, fromIsoToLocalInput, toIsoDateTime };

export type EstadoPromocion = "vigente" | "programada" | "expirada" | "inactiva";

export function getTipoPromocionLabel(tipo: TipoPromocion): string {
  return TIPO_PROMOCION_LABEL[tipo];
}

export function formatPromocionResumen(promo: Promocion): string {
  switch (promo.tipo) {
    case "PORCENTAJE":
      return promo.valorPorcentaje != null ? `${promo.valorPorcentaje}% dto` : "Porcentaje";
    case "MONTO_FIJO":
      return promo.valorMonto != null ? `${formatCOP(promo.valorMonto)} dto` : "Monto fijo";
    case "PAGA_X_LLEVA_Y":
      return promo.pagaCantidad != null && promo.llevaCantidad != null
        ? `Paga ${promo.pagaCantidad} lleva ${promo.llevaCantidad}`
        : "Paga X lleva Y";
    default:
      return getTipoPromocionLabel(promo.tipo);
  }
}

export function getEstadoPromocion(promo: Promocion, ahora = new Date()): EstadoPromocion {
  if (!promo.activo) return "inactiva";
  if (promo.vigente) return "vigente";

  const inicio = new Date(promo.fechaInicio);
  if (inicio > ahora) return "programada";

  if (promo.fechaFin) {
    const fin = new Date(promo.fechaFin);
    if (fin <= ahora) return "expirada";
  }

  if (promo.usoMaximo != null && promo.usoActual >= promo.usoMaximo) {
    return "expirada";
  }

  return "expirada";
}

export function getEstadoPromocionLabel(estado: EstadoPromocion): string {
  switch (estado) {
    case "vigente":
      return "Vigente";
    case "programada":
      return "Programada";
    case "expirada":
      return "Expirada";
    case "inactiva":
      return "Inactiva";
  }
}
