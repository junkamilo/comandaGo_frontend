import { z } from "zod";

export const unidadInsumoSchema = z.enum(["UND", "GR", "ML", "KG", "LT", "PORCION"]);

export const ingredienteFormSchema = z.object({
  productoId: z.coerce
    .number({ invalid_type_error: "Selecciona un insumo" })
    .int()
    .positive("Selecciona un insumo válido"),
  cantidad: z.coerce.number().min(0.01, "La cantidad debe ser mayor a 0").default(1),
  unidad: unidadInsumoSchema.default("UND"),
  esRemovible: z.boolean().default(false),
  orden: z.coerce.number().int().min(0).default(0),
});

const baseRecetaFields = {
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(150, "El nombre no puede superar 150 caracteres"),
  descripcion: z.string().max(5000).optional().or(z.literal("")),
  preparacion: z.string().max(20000).optional().or(z.literal("")),
  tiempoTotalMin: z.coerce.number().int().min(0).optional().nullable(),
  activo: z.boolean().default(true),
  ingredientes: z.array(ingredienteFormSchema).min(1, "La receta debe tener al menos un ingrediente"),
};

function withIngredienteRules<T extends z.ZodTypeAny>(schema: T) {
  return schema.superRefine((values, ctx) => {
    const data = values as { ingredientes: z.infer<typeof ingredienteFormSchema>[] };
    const seen = new Set<number>();
    data.ingredientes.forEach((linea, index) => {
      if (seen.has(linea.productoId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "No se puede repetir el mismo insumo",
          path: ["ingredientes", index, "productoId"],
        });
      }
      seen.add(linea.productoId);
    });
  });
}

export const crearRecetaSchema = withIngredienteRules(z.object({ ...baseRecetaFields }));
export type CrearRecetaFormValues = z.infer<typeof crearRecetaSchema>;

export const editarRecetaSchema = withIngredienteRules(z.object({ ...baseRecetaFields }));
export type EditarRecetaFormValues = z.infer<typeof editarRecetaSchema>;
export type RecetaFormValues = CrearRecetaFormValues | EditarRecetaFormValues;
