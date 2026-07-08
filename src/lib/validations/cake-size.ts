import { z } from "zod";

export const cakeSizeSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  width: z.number().positive("Debe ser un número positivo."),
  height: z.number().positive("Debe ser un número positivo."),
  published: z.boolean(),
});

export type CakeSizeFormValues = z.infer<typeof cakeSizeSchema>;
