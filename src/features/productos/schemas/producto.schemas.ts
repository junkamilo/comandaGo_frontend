import { z } from "zod";

const descripcionSchema = z
  .string()
  .max(2000, "La descripción no puede superar 2000 caracteres")
  .optional()
  .or(z.literal(""));

const precioSchema = z.coerce
  .number({ invalid_type_error: "El precio es obligatorio" })
  .min(0, "El precio debe ser mayor o igual a 0");

const baseProductoFields = {
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(150, "El nombre no puede superar 150 caracteres"),
  descripcion: descripcionSchema,
  precio: precioSchema,
  tiempoPreparacionMin: z.coerce
    .number()
    .int()
    .min(0, "El tiempo de preparación debe ser mayor o igual a 0")
    .optional(),
};

export const crearProductoSchema = z.object({
  categoriaId: z.coerce
    .number({ invalid_type_error: "Selecciona una categoría" })
    .int()
    .positive("Selecciona una categoría válida"),
  ...baseProductoFields,
});

export type CrearProductoFormValues = z.infer<typeof crearProductoSchema>;

export const editarProductoSchema = z.object({
  categoriaId: z.coerce
    .number({ invalid_type_error: "Selecciona una categoría" })
    .int()
    .positive("Selecciona una categoría válida"),
  ...baseProductoFields,
  disponible: z.boolean(),
});

export type EditarProductoFormValues = z.infer<typeof editarProductoSchema>;
