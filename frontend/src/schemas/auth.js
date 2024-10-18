import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({
    message: "Porfavor ingrese un correo valido",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres",
  }),
});

export const registerSchema = z
  .object({
    username: z
      .string({
        required_error: "Usuario requerido",
      })
      .min(3, {
        message: "Usuario con al menos tres caracteres",
      }),
    email: z.string().email({
      message: "Ingrese un correo valido",
    }),
    password: z.string().min(6, {
      message: "Contraseña con al menos 3 caracteres",
    }),
    confirmPassword: z.string().min(6, {
      message: "Contraseña con al menos 3 caracteres",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["Confirmar contraseña"],
  });