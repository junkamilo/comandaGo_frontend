import { z } from "zod";

const descripcionSchema = z
  .string()
  .max(2000, "La descripción no puede superar 2000 caracteres")
  .optional()
  .or(z.literal(""));

const precioSchema = z.coerce
  .number({ invalid_type_error: "El precio es obligatorio" })
  .min(0, "El precio debe ser mayor o igual a 0");

const precioPromocionSchema = z.coerce
  .number({ invalid_type_error: "Ingresa un precio de promoción válido" })
  .min(0, "El precio de promoción debe ser mayor o igual a 0")
  .optional();

const promocionRefine = {
  check: (d: { esPromocion: boolean; precio: number; precioPromocion?: number }) =>
    !d.esPromocion || (d.precioPromocion != null && d.precioPromocion < d.precio),
  message: "El precio de promoción debe ser menor al precio normal",
  path: ["precioPromocion"] as const,
};

const baseProductoFields = {
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(150, "El nombre no puede superar 150 caracteres"),
  descripcion: descripcionSchema,
  precio: precioSchema,
  esPromocion: z.boolean(),
  precioPromocion: precioPromocionSchema,
  tiempoPreparacionMin: z.coerce
    .number()
    .int()
    .min(0, "El tiempo de preparación debe ser mayor o igual a 0")
    .optional(),
  orden: z.coerce.number().int().min(0, "El orden debe ser mayor o igual a 0"),
};

export const crearProductoSchema = z
  .object({
    categoriaId: z.coerce
      .number({ invalid_type_error: "Selecciona una categoría" })
      .int()
      .positive("Selecciona una categoría válida"),
    ...baseProductoFields,
  })
  .refine(promocionRefine.check, {
    message: promocionRefine.message,
    path: [...promocionRefine.path],
  })
  .refine((d) => !d.esPromocion || d.precioPromocion != null, {
    message: "El precio de promoción es obligatorio cuando el producto está en promoción",
    path: ["precioPromocion"],
  });

export type CrearProductoFormValues = z.infer<typeof crearProductoSchema>;

export const editarProductoSchema = z
  .object({
    categoriaId: z.coerce
      .number({ invalid_type_error: "Selecciona una categoría" })
      .int()
      .positive("Selecciona una categoría válida"),
    ...baseProductoFields,
    disponible: z.boolean(),
  })
  .refine(promocionRefine.check, {
    message: promocionRefine.message,
    path: [...promocionRefine.path],
  })
  .refine((d) => !d.esPromocion || d.precioPromocion != null, {
    message: "El precio de promoción es obligatorio cuando el producto está en promoción",
    path: ["precioPromocion"],
  });

export type EditarProductoFormValues = z.infer<typeof editarProductoSchema>;
