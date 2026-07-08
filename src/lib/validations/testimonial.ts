import { z } from "zod";
import { imagePositionSchema } from "@/lib/validations/image-position";

export const testimonialSchema = z.object({
  authorName: z.string().min(2, "El nombre es obligatorio."),
  authorRole: z.string().nullable(),
  content: z.string().min(10, "Añade el testimonio completo."),
  avatarUrl: z.string().nullable(),
  imagePosition: imagePositionSchema.nullable(),
  published: z.boolean(),
});

export type TestimonialFormValues = z.infer<typeof testimonialSchema>;
