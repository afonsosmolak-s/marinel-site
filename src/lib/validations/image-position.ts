import { z } from "zod";

export const imagePositionSchema = z.object({
  focalX: z.number().min(0).max(100),
  focalY: z.number().min(0).max(100),
  zoom: z.number().min(1).max(3),
});
