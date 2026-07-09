import { z } from "zod";

export const cakeOrderSchema = z.object({
  occasion: z.string().min(1, "Selecciona una ocasión."),
  style: z.string().min(1, "Selecciona un estilo."),
  flavour: z.string().min(1, "Selecciona un bizcocho."),
  filling: z.string().min(1, "Selecciona un relleno."),
  size: z.string().min(1, "Selecciona un tamaño."),
  sizeDimensions: z.string().min(1, "Selecciona un tamaño."),
  desiredDate: z.string().min(1, "Selecciona una fecha."),
  description: z.string().min(10, "Cuéntanos un poco más sobre tu idea."),
  fullName: z.string().min(2, "Introduce tu nombre completo."),
  phone: z.string().min(6, "Introduce un teléfono válido."),
  email: z.string().email("Introduce un email válido."),
});

export type CakeOrderFormValues = z.infer<typeof cakeOrderSchema>;
