import { z } from "zod";
import { imagePositionSchema } from "@/lib/validations/image-position";

export const masterclassSchema = z.object({
  title: z.string().min(2, "El título es obligatorio."),
  description: z.string().min(10, "Añade una descripción más completa."),
  date: z.string().nullable(),
  location: z.string().nullable(),
  imageUrl: z.string().nullable(),
  imagePosition: imagePositionSchema.nullable(),
  capacity: z.number().int().positive().nullable(),
  published: z.boolean(),
});

export type MasterclassFormValues = z.infer<typeof masterclassSchema>;
