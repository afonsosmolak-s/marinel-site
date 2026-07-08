import { z } from "zod";

export const cakeStyleSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  published: z.boolean(),
});

export type CakeStyleFormValues = z.infer<typeof cakeStyleSchema>;
