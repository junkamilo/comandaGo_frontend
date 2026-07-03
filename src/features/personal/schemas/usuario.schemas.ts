import { z } from "zod";

import { ROLES_STAFF } from "@/features/personal/constants/roles-staff";

const strongPassword = z
  .string()
  .min(8, "La contraseña debe tener mínimo 8 caracteres")
  .max(72, "La contraseña no puede superar 72 caracteres")
  .regex(/[a-z]/, "Debe incluir al menos una minúscula")
  .regex(/[A-Z]/, "Debe incluir al menos una mayúscula")
  .regex(/\d/, "Debe incluir al menos un dígito");

const telefonoSchema = z
  .string()
  .regex(/^[0-9+\-() ]{7,30}$/, "El teléfono no es válido")
  .optional()
  .or(z.literal(""));

const rolStaffSchema = z.enum(ROLES_STAFF, {
  errorMap: () => ({ message: "Selecciona un rol válido" }),
});

export const crearUsuarioSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar 100 caracteres"),
  email: z.string().min(1, "El email es obligatorio").email("El email no es válido"),
  password: strongPassword,
  telefono: telefonoSchema,
  rol: rolStaffSchema,
});

export type CrearUsuarioFormValues = z.infer<typeof crearUsuarioSchema>;

export const editarUsuarioSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar 100 caracteres"),
  email: z.string().min(1, "El email es obligatorio").email("El email no es válido"),
  telefono: telefonoSchema,
  rol: rolStaffSchema,
});

export type EditarUsuarioFormValues = z.infer<typeof editarUsuarioSchema>;

export const resetPasswordSchema = z
  .object({
    password: strongPassword,
    confirmPassword: z.string().min(1, "Confirma la contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
