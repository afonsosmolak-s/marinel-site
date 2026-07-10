"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { siteSettingsSchema } from "@/lib/validations/settings";
import { updateSiteSettings } from "@/services/settings";

export async function updateSiteSettingsAction(
  input: unknown,
): Promise<{ success: true } | { success: false; error: string }> {
  await requireAdmin();
  const parsed = siteSettingsSchema.partial().safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Revisa los datos del formulario." };
  }
  await updateSiteSettings(parsed.data);
  revalidatePath("/");
  revalidatePath("/admin/configuracion");
  return { success: true };
}
