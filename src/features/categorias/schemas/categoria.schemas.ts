import { z } from "zod";

const descripcionSchema = z
  .string()
  .max(2000, "La descripción no puede superar 2000 caracteres")
  .optional()
  .or(z.literal(""));

const categoriaPadreIdSchema = z.union([
  z.literal("none"),
  z.coerce.number().int().positive("Selecciona una categoría padre válida"),
]);

export const crearCategoriaSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(100, "El nombre no puede superar 100 caracteres"),
  descripcion: descripcionSchema,
  categoriaPadreId: categoriaPadreIdSchema,
});

export type CrearCategoriaFormValues = z.infer<typeof crearCategoriaSchema>;

export const editarCategoriaSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(100, "El nombre no puede superar 100 caracteres"),
  descripcion: descripcionSchema,
  categoriaPadreId: categoriaPadreIdSchema,
});

export type EditarCategoriaFormValues = z.infer<typeof editarCategoriaSchema>;

export type CategoriaImagenState = {
  imagenUrl: string | null;
  imagenEliminada: boolean;
};
