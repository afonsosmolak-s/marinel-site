"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { cakeOccasionSchema } from "@/lib/validations/cake-occasion";
import * as cakeOccasionsService from "@/services/cake-occasions";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/ocasiones");
}

export async function createCakeOccasionAction(
  input: unknown,
): Promise<{ success: true } | { success: false; error: string }> {
  await requireAdmin();
  const parsed = cakeOccasionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Revisa los datos de la ocasión." };
  }
  await cakeOccasionsService.createCakeOccasion(parsed.data);
  revalidate();
  return { success: true };
}

export async function updateCakeOccasionAction(
  id: string,
  input: unknown,
): Promise<{ success: true } | { success: false; error: string }> {
  await requireAdmin();
  const parsed = cakeOccasionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Revisa los datos de la ocasión." };
  }
  await cakeOccasionsService.updateCakeOccasion(id, parsed.data);
  revalidate();
  return { success: true };
}

export async function deleteCakeOccasionAction(id: string): Promise<void> {
  await requireAdmin();
  await cakeOccasionsService.deleteCakeOccasion(id);
  revalidate();
}

export async function toggleCakeOccasionPublishedAction(
  id: string,
): Promise<void> {
  await requireAdmin();
  await cakeOccasionsService.toggleCakeOccasionPublished(id);
  revalidate();
}

export async function reorderCakeOccasionsAction(
  orderedIds: string[],
): Promise<void> {
  await requireAdmin();
  await cakeOccasionsService.reorderCakeOccasions(orderedIds);
  revalidate();
}
