"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { cakeFillingSchema } from "@/lib/validations/cake-filling";
import * as cakeFillingsService from "@/services/cake-fillings";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/rellenos");
}

export async function createCakeFillingAction(
  input: unknown,
): Promise<{ success: true } | { success: false; error: string }> {
  await requireAdmin();
  const parsed = cakeFillingSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Revisa los datos del relleno." };
  }
  await cakeFillingsService.createCakeFilling(parsed.data);
  revalidate();
  return { success: true };
}

export async function updateCakeFillingAction(
  id: string,
  input: unknown,
): Promise<{ success: true } | { success: false; error: string }> {
  await requireAdmin();
  const parsed = cakeFillingSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Revisa los datos del relleno." };
  }
  await cakeFillingsService.updateCakeFilling(id, parsed.data);
  revalidate();
  return { success: true };
}

export async function deleteCakeFillingAction(id: string): Promise<void> {
  await requireAdmin();
  await cakeFillingsService.deleteCakeFilling(id);
  revalidate();
}

export async function toggleCakeFillingPublishedAction(
  id: string,
): Promise<void> {
  await requireAdmin();
  await cakeFillingsService.toggleCakeFillingPublished(id);
  revalidate();
}

export async function reorderCakeFillingsAction(
  orderedIds: string[],
): Promise<void> {
  await requireAdmin();
  await cakeFillingsService.reorderCakeFillings(orderedIds);
  revalidate();
}
