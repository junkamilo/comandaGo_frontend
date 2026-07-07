import type { TipoPromocion } from "@/features/promociones/types/promocion.types";

export const TIPO_PROMOCION_OPTIONS: { value: TipoPromocion; label: string }[] = [
  { value: "PORCENTAJE", label: "Porcentaje" },
  { value: "MONTO_FIJO", label: "Monto de descuento" },
  { value: "PRECIO_FIJO", label: "Precio fijo" },
  { value: "PAGA_X_LLEVA_Y", label: "Paga X lleva Y" },
];

export const TIPO_PROMOCION_LABEL: Record<TipoPromocion, string> = {
  PORCENTAJE: "Porcentaje",
  MONTO_FIJO: "Monto de descuento",
  PRECIO_FIJO: "Precio fijo",
  PAGA_X_LLEVA_Y: "Paga X lleva Y",
};
