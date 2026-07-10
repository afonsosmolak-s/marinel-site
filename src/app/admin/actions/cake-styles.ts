"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { cakeStyleSchema } from "@/lib/validations/cake-style";
import * as cakeStylesService from "@/services/cake-styles";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/estilos");
}

export async function createCakeStyleAction(
  input: unknown,
): Promise<{ success: true } | { success: false; error: string }> {
  await requireAdmin();
  const parsed = cakeStyleSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Revisa los datos del estilo." };
  }
  await cakeStylesService.createCakeStyle(parsed.data);
  revalidate();
  return { success: true };
}

export async function updateCakeStyleAction(
  id: string,
  input: unknown,
): Promise<{ success: true } | { success: false; error: string }> {
  await requireAdmin();
  const parsed = cakeStyleSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Revisa los datos del estilo." };
  }
  await cakeStylesService.updateCakeStyle(id, parsed.data);
  revalidate();
  return { success: true };
}

export async function deleteCakeStyleAction(id: string): Promise<void> {
  await requireAdmin();
  await cakeStylesService.deleteCakeStyle(id);
  revalidate();
}

export async function toggleCakeStylePublishedAction(
  id: string,
): Promise<void> {
  await requireAdmin();
  await cakeStylesService.toggleCakeStylePublished(id);
  revalidate();
}

export async function reorderCakeStylesAction(
  orderedIds: string[],
): Promise<void> {
  await requireAdmin();
  await cakeStylesService.reorderCakeStyles(orderedIds);
  revalidate();
}
