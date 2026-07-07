import { z } from "zod";

import type { TipoPromocion } from "@/features/promociones/types/promocion.types";

const tipoPromocionSchema = z.enum(["PORCENTAJE", "MONTO_FIJO", "PRECIO_FIJO", "PAGA_X_LLEVA_Y"]);

const optionalPositiveInt = z.preprocess(
  (val) => (val === "" || val === undefined || val === null ? undefined : val),
  z.coerce.number().int("Debe ser un número entero").positive("Debe ser mayor a 0").optional(),
);

const optionalPositiveNumber = z.preprocess(
  (val) => (val === "" || val === undefined || val === null ? undefined : val),
  z.coerce.number().positive("Debe ser mayor a 0").optional(),
);

const basePromocionFields = {
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(150, "El nombre no puede superar 150 caracteres"),
  descripcion: z.string().max(2000, "La descripción no puede superar 2000 caracteres").optional(),
  tipo: tipoPromocionSchema,
  valorPorcentaje: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : val),
    z.coerce
      .number()
      .positive("El porcentaje debe ser mayor a 0")
      .max(100, "El porcentaje no puede superar 100")
      .optional(),
  ),
  valorMonto: optionalPositiveNumber,
  valorPrecio: optionalPositiveNumber,
  pagaCantidad: optionalPositiveInt,
  llevaCantidad: optionalPositiveInt,
  fechaInicio: z.string().min(1, "La fecha de inicio es obligatoria"),
  fechaFin: z.string().optional(),
  usoMaximo: optionalPositiveInt,
  activo: z.boolean(),
  productoIds: z.array(z.number().int().positive()).min(1, "Debe incluir al menos un producto"),
};

function validarPorTipo(
  data: {
    tipo: TipoPromocion;
    valorPorcentaje?: number;
    valorMonto?: number;
    valorPrecio?: number;
    pagaCantidad?: number;
    llevaCantidad?: number;
  },
  ctx: z.RefinementCtx,
) {
  switch (data.tipo) {
    case "PORCENTAJE":
      if (data.valorPorcentaje == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El porcentaje es obligatorio",
          path: ["valorPorcentaje"],
        });
      }
      break;
    case "MONTO_FIJO":
      if (data.valorMonto == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El monto de descuento es obligatorio",
          path: ["valorMonto"],
        });
      }
      break;
    case "PRECIO_FIJO":
      if (data.valorPrecio == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El precio de la promoción es obligatorio",
          path: ["valorPrecio"],
        });
      }
      break;
    case "PAGA_X_LLEVA_Y":
      if (data.pagaCantidad == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La cantidad a pagar es obligatoria",
          path: ["pagaCantidad"],
        });
      }
      if (data.llevaCantidad == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La cantidad a llevar es obligatoria",
          path: ["llevaCantidad"],
        });
      }
      if (
        data.pagaCantidad != null &&
        data.llevaCantidad != null &&
        data.llevaCantidad <= data.pagaCantidad
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La cantidad a llevar debe ser mayor a la cantidad a pagar",
          path: ["llevaCantidad"],
        });
      }
      break;
  }
}

function validarFechas(data: { fechaInicio: string; fechaFin?: string }, ctx: z.RefinementCtx) {
  if (!data.fechaFin) return;
  const inicio = new Date(data.fechaInicio);
  const fin = new Date(data.fechaFin);
  if (fin <= inicio) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "La fecha de fin debe ser posterior a la de inicio",
      path: ["fechaFin"],
    });
  }
}

const promocionSchema = z
  .object(basePromocionFields)
  .superRefine(validarPorTipo)
  .superRefine(validarFechas);

export const crearPromocionSchema = promocionSchema;
export type CrearPromocionFormValues = z.infer<typeof crearPromocionSchema>;

export const editarPromocionSchema = promocionSchema;
export type EditarPromocionFormValues = z.infer<typeof editarPromocionSchema>;

export type PromocionFormValues = CrearPromocionFormValues;
