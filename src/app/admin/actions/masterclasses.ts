"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { masterclassSchema } from "@/lib/validations/masterclass";
import * as masterclassesService from "@/services/masterclasses";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/masterclass");
}

export async function createMasterclassAction(
  input: unknown,
): Promise<{ success: true } | { success: false; error: string }> {
  await requireAdmin();
  const parsed = masterclassSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Revisa los datos de la masterclass." };
  }
  await masterclassesService.createMasterclass(parsed.data);
  revalidate();
  return { success: true };
}

export async function updateMasterclassAction(
  id: string,
  input: unknown,
): Promise<{ success: true } | { success: false; error: string }> {
  await requireAdmin();
  const parsed = masterclassSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Revisa los datos de la masterclass." };
  }
  await masterclassesService.updateMasterclass(id, parsed.data);
  revalidate();
  return { success: true };
}

export async function deleteMasterclassAction(id: string): Promise<void> {
  await requireAdmin();
  await masterclassesService.deleteMasterclass(id);
  revalidate();
}

export async function toggleMasterclassPublishedAction(
  id: string,
): Promise<void> {
  await requireAdmin();
  await masterclassesService.toggleMasterclassPublished(id);
  revalidate();
}
