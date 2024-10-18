import { z } from "zod";

export const createGarantia_dispositivoSchema = z.object({
    Nro_factura: z.string({
        required_error: "Requerido",
    }).transform((num) => parseInt(num)),
    equipo_comprado: z.string({
        required_error: "Requerido",
    }),
    nombre_cliente: z.string({
        required_error: "Requerido",
    }),
    apellido_cliente: z.string({
        required_error: "Requerido",
    }),
    nit_cliente: z.string({
        required_error: "Requerido",
    }).transform((num) => parseInt(num)),
    garantia: z.boolean({
        required_error: "Requerido",
    }),//.transform((val) => val === 'true'),
    tiempo_garantia: z.string().nullable().optional(),

});