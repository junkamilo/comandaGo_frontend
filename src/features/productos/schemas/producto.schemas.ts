import { z } from "zod";

const descripcionSchema = z
  .string()
  .max(2000, "La descripción no puede superar 2000 caracteres")
  .optional()
  .or(z.literal(""));

const precioSchema = z.coerce
  .number({ invalid_type_error: "El precio es obligatorio" })
  .min(0, "El precio debe ser mayor o igual a 0");

export const tipoProductoSchema = z.enum(["NORMAL", "COMPUESTO", "INSUMO"]);
export const unidadInsumoSchema = z.enum(["UND", "GR", "ML", "KG", "LT", "PORCION"]);

export const productoInsumoFormSchema = z.object({
  productoInsumoId: z.coerce
    .number({ invalid_type_error: "Selecciona un insumo" })
    .int()
    .positive("Selecciona un insumo válido"),
  cantidad: z.coerce.number().min(0.01, "La cantidad debe ser mayor a 0").default(1),
  unidad: unidadInsumoSchema.default("UND"),
  esRemovible: z.boolean().default(true),
  esExtra: z.boolean().default(false),
  precioExtra: z.coerce.number().min(0).optional().nullable(),
  orden: z.coerce.number().int().min(0).default(0),
});

/** 0 / vacío = sin categoría (válido solo para INSUMO). */
const categoriaIdField = z.preprocess(
  (val) => {
    if (val === "" || val === null || val === undefined) return null;
    const n = Number(val);
    if (Number.isNaN(n) || n <= 0) return null;
    return n;
  },
  z.number().int().positive().nullable(),
);

const recetaIdField = z.preprocess(
  (val) => {
    if (val === "" || val === null || val === undefined) return null;
    const n = Number(val);
    if (Number.isNaN(n) || n <= 0) return null;
    return n;
  },
  z.number().int().positive().nullable(),
);

const baseProductoFields = {
  categoriaId: categoriaIdField,
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(150, "El nombre no puede superar 150 caracteres"),
  descripcion: descripcionSchema,
  precio: precioSchema,
  tipo: tipoProductoSchema.default("NORMAL"),
  composicion: z.array(productoInsumoFormSchema).default([]),
  recetaId: recetaIdField,
};

function withProductoRules<T extends z.ZodTypeAny>(schema: T) {
  return schema.superRefine((values, ctx) => {
    const data = values as {
      tipo: z.infer<typeof tipoProductoSchema>;
      categoriaId: number | null;
      composicion: z.infer<typeof productoInsumoFormSchema>[];
      recetaId: number | null;
    };

    if (data.tipo !== "INSUMO" && data.categoriaId == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecciona una categoría",
        path: ["categoriaId"],
      });
    }

    if (data.tipo === "COMPUESTO" && data.recetaId == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecciona una receta",
        path: ["recetaId"],
      });
    }
    if (data.tipo !== "COMPUESTO" && data.recetaId != null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Solo un producto compuesto puede tener receta",
        path: ["recetaId"],
      });
    }
    if (data.composicion?.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La composición embebida ya no se usa; asigna una receta",
        path: ["composicion"],
      });
    }
  });
}

export const crearProductoSchema = withProductoRules(z.object({ ...baseProductoFields }));

export type CrearProductoFormValues = z.infer<typeof crearProductoSchema>;

export const editarProductoSchema = withProductoRules(
  z.object({
    ...baseProductoFields,
    disponible: z.boolean(),
  }),
);

export type EditarProductoFormValues = z.infer<typeof editarProductoSchema>;
