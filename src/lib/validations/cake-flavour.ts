import { z } from "zod";

export const cakeFlavourSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  published: z.boolean(),
  imageUrl: z.string().nullable(),
});

export type CakeFlavourFormValues = z.infer<typeof cakeFlavourSchema>;
