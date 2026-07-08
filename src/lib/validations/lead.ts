import { z } from "zod";

export const leadSchema = z.object({
  fullName: z.string().min(2, "Introduce tu nombre completo."),
  phone: z.string().min(6, "Introduce un teléfono válido."),
  email: z.string().email("Introduce un email válido."),
  city: z.string().min(2, "Introduce tu ciudad."),
  courseInterest: z.string().min(1, "Selecciona una opción."),
  experienceLevel: z.string().min(1, "Selecciona una opción."),
  goal: z.string().optional(),
  message: z.string().optional(),
});

export type LeadFormValues = z.infer<typeof leadSchema>;

export const EXPERIENCE_LEVELS = [
  "Sin experiencia",
  "Iniciación",
  "Intermedio",
  "Avanzado",
] as const;
