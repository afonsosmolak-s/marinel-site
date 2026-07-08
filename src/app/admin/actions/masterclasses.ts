"use server";

import { revalidatePath } from "next/cache";
import { masterclassSchema } from "@/lib/validations/masterclass";
import * as masterclassesService from "@/services/masterclasses";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/masterclass");
}

export async function createMasterclassAction(
  input: unknown,
): Promise<{ success: true } | { success: false; error: string }> {
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
  const parsed = masterclassSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Revisa los datos de la masterclass." };
  }
  await masterclassesService.updateMasterclass(id, parsed.data);
  revalidate();
  return { success: true };
}

export async function deleteMasterclassAction(id: string): Promise<void> {
  await masterclassesService.deleteMasterclass(id);
  revalidate();
}

export async function toggleMasterclassPublishedAction(
  id: string,
): Promise<void> {
  await masterclassesService.toggleMasterclassPublished(id);
  revalidate();
}
