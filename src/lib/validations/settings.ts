import { z } from "zod";
import { imagePositionSchema } from "@/lib/validations/image-position";

// Acepta vacío o un URL http(s). Bloquea esquemas peligrosos (javascript:,
// data:, etc.) que, en un href o en el src del iframe del mapa, serían un
// vector de XSS. Solo la admin puede editar estos campos, pero es defensa extra.
const safeUrl = z
  .string()
  .trim()
  .refine(
    (value) => {
      if (value === "") return true;
      try {
        const protocol = new URL(value).protocol;
        return protocol === "https:" || protocol === "http:";
      } catch {
        return false;
      }
    },
    { message: "Debe ser un enlace válido (http:// o https://)." },
  );

export const siteSettingsSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroTitleAccent: z.string(),
  heroSubtitle: z.string(),
  heroImageUrl: z.string().nullable(),
  heroImagePosition: imagePositionSchema.nullable(),
  aboutTitle: z.string(),
  aboutTitleAccent: z.string(),
  aboutBody: z.array(z.string()),
  aboutImageUrl: z.string().nullable(),
  aboutImagePosition: imagePositionSchema.nullable(),
  instagramUrl: safeUrl,
  tiktokUrl: safeUrl,
  whatsappUrl: safeUrl,
  whatsappNumber: z.string(),
  communityUrl: safeUrl,
  phone: z.string(),
  email: z.string(),
  city: z.string(),
  address: z.string(),
  mapEmbedUrl: safeUrl,
  seoTitle: z.string(),
  seoDescription: z.string(),
  legalHolderName: z.string(),
  legalNif: z.string(),
  legalAddress: z.string(),
  legalCity: z.string(),
  legalEmail: z.string(),
  legalPhone: z.string(),
});

export type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;
