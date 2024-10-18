import { z } from "zod";

export const createTecnicoSchema = z.object({
    nombre: z.string({
        required_error: "Requerido",
    }),
    apellido: z.string({
        required_error: "Requerido",
    }),
    password: z
        .string({
            required_error: "Contraseña requerida",
        })
        .min(6, {
            message: "Contraseña de al menos 6 caracteres",
        }),
    email: z
        .string({
            required_error: "Email requerido",
        })
        .email({
            message: "Email no valido",
        }),
    especialidad: z.string({
        required_error: "Requerido",
    }),
});
