import { z } from "zod";

export const cakeFillingSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  published: z.boolean(),
  imageUrl: z.string().nullable(),
});

export type CakeFillingFormValues = z.infer<typeof cakeFillingSchema>;
