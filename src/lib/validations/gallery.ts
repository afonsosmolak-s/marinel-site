import { z } from "zod";
import { imagePositionSchema } from "@/lib/validations/image-position";
import { GALLERY_CATEGORIES } from "@/types/content";

export const galleryImageSchema = z.object({
  imageUrl: z.string().nullable(),
  imagePosition: imagePositionSchema.nullable(),
  caption: z.string().nullable(),
  categories: z.array(z.enum(GALLERY_CATEGORIES)),
  featured: z.boolean(),
  published: z.boolean(),
});

export type GalleryImageFormValues = z.infer<typeof galleryImageSchema>;
