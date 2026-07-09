import { z } from "zod";
import { imagePositionSchema } from "@/lib/validations/image-position";

export const courseSchema = z.object({
  title: z.string().min(2, "El título es obligatorio."),
  description: z.string().min(10, "Añade una descripción más completa."),
  level: z.enum(["Iniciación", "Intermedio", "Avanzado"]),
  format: z.enum(["Presencial", "Online", "Ebook"]),
  imageUrl: z.string().nullable(),
  imagePosition: imagePositionSchema.nullable(),
  startDate: z.string().nullable(),
  availablePlaces: z.number().int().positive().nullable(),
  duration: z.string().nullable(),
  badge: z.string().nullable(),
  price: z.string().nullable(),
  checkoutUrl: z.string().nullable(),
  featured: z.boolean(),
  published: z.boolean(),
});

export type CourseFormValues = z.infer<typeof courseSchema>;
