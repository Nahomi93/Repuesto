import { z } from "zod";

export const clienteSchema = z.object({
  nombre: z.string({
    required_error: "nombre is required",
  }),
  password: z.string({
    required_error: "password is required",
  }),
  email: z.string({
    required_error: "email is required",
  }),
});