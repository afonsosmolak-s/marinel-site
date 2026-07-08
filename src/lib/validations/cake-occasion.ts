import { z } from "zod";

export const cakeOccasionSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  published: z.boolean(),
});

export type CakeOccasionFormValues = z.infer<typeof cakeOccasionSchema>;
