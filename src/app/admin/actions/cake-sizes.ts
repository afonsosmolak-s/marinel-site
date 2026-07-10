"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { cakeSizeSchema } from "@/lib/validations/cake-size";
import * as cakeSizesService from "@/services/cake-sizes";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/tamanos");
}

export async function createCakeSizeAction(
  input: unknown,
): Promise<{ success: true } | { success: false; error: string }> {
  await requireAdmin();
  const parsed = cakeSizeSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Revisa los datos del tamaño." };
  }
  await cakeSizesService.createCakeSize(parsed.data);
  revalidate();
  return { success: true };
}

export async function updateCakeSizeAction(
  id: string,
  input: unknown,
): Promise<{ success: true } | { success: false; error: string }> {
  await requireAdmin();
  const parsed = cakeSizeSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Revisa los datos del tamaño." };
  }
  await cakeSizesService.updateCakeSize(id, parsed.data);
  revalidate();
  return { success: true };
}

export async function deleteCakeSizeAction(id: string): Promise<void> {
  await requireAdmin();
  await cakeSizesService.deleteCakeSize(id);
  revalidate();
}

export async function toggleCakeSizePublishedAction(id: string): Promise<void> {
  await requireAdmin();
  await cakeSizesService.toggleCakeSizePublished(id);
  revalidate();
}

export async function reorderCakeSizesAction(
  orderedIds: string[],
): Promise<void> {
  await requireAdmin();
  await cakeSizesService.reorderCakeSizes(orderedIds);
  revalidate();
}
