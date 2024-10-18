import { z } from "zod";

export const createReparacionSchema = z.object({
  cliente: z.string({
    required_error: "Requerido",
  }),
  tecnico: z.string({
    required_error: "Requerido",
  }),
  fecha_recepcion: z.string().datetime().optional(),
  fecha_devolucion: z.string().datetime().optional(),
  //accesorios_dejados: z.array(z.string()).optional(),
  accesorios_dejados: z.string().optional().transform((str) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      return [];  // Devuelve un array vacío si hay un error al parsear
    }
  }),
  description_problema: z.string().optional(),

  problemaDiagnosticado: z.string().optional(),
  garantia: z.string().optional().transform((val) => val === 'true'),
  
  costo: z.string().optional().transform((num) => parseInt(num)),
  //fotos: z.array(z.string()).optional(),
  fotos: z.string().optional().transform((str) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      return [];  // Devuelve un array vacío si hay un error al parsear
    }
  }),
  calificacion: z.string().optional().transform((num) => parseInt(num)),

  aceptacion_cambios: z.string().optional().transform((val) => val === 'true'),
  // Agregando el campo cotizacion
  cotizacion: z.string().optional().transform((str) => {
    try {
      const parsedCotizaciones = JSON.parse(str);
      return Array.isArray(parsedCotizaciones) ? parsedCotizaciones.map((item) => ({
        componente: item.componente,  // Asegúrate de que este campo esté en el objeto
        precio: parseFloat(item.precio),  // Convierte a número
        aceptado: item.aceptado === 'true',  // Transforma 'true' en booleano
      })) : [];  // Devuelve un array vacío si no es un array
    } catch (e) {
      console.error("Error parsing cotizaciones:", e);
      return [];  // Devuelve un array vacío si hay un error al parsear
    }
  }),
  finalizado: z.string().optional().transform((val) => val === 'true'),
});