import { z } from "zod";

const nombreSchema = z
  .string()
  .max(50, "El nombre no puede superar 50 caracteres")
  .optional()
  .or(z.literal(""));

export const crearMesaSchema = z.object({
  numero: z
    .string()
    .min(1, "El número de mesa es obligatorio")
    .max(20, "El número no puede superar 20 caracteres"),
  nombre: nombreSchema,
  capacidad: z.coerce
    .number()
    .int()
    .min(1, "La capacidad debe ser al menos 1")
    .optional(),
});

export type CrearMesaFormValues = z.infer<typeof crearMesaSchema>;

export const editarMesaSchema = z.object({
  numero: z
    .string()
    .min(1, "El número de mesa es obligatorio")
    .max(20, "El número no puede superar 20 caracteres"),
  nombre: nombreSchema,
  capacidad: z.coerce
    .number()
    .int()
    .min(1, "La capacidad debe ser al menos 1")
    .optional(),
});

export type EditarMesaFormValues = z.infer<typeof editarMesaSchema>;
