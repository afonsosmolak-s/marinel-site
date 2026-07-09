"use server";

import { revalidatePath } from "next/cache";
import { cakeFlavourSchema } from "@/lib/validations/cake-flavour";
import * as cakeFlavoursService from "@/services/cake-flavours";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/bizcochos");
}

export async function createCakeFlavourAction(
  input: unknown,
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = cakeFlavourSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Revisa los datos del bizcocho." };
  }
  await cakeFlavoursService.createCakeFlavour(parsed.data);
  revalidate();
  return { success: true };
}

export async function updateCakeFlavourAction(
  id: string,
  input: unknown,
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = cakeFlavourSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Revisa los datos del bizcocho." };
  }
  await cakeFlavoursService.updateCakeFlavour(id, parsed.data);
  revalidate();
  return { success: true };
}

export async function deleteCakeFlavourAction(id: string): Promise<void> {
  await cakeFlavoursService.deleteCakeFlavour(id);
  revalidate();
}

export async function toggleCakeFlavourPublishedAction(
  id: string,
): Promise<void> {
  await cakeFlavoursService.toggleCakeFlavourPublished(id);
  revalidate();
}

export async function reorderCakeFlavoursAction(
  orderedIds: string[],
): Promise<void> {
  await cakeFlavoursService.reorderCakeFlavours(orderedIds);
  revalidate();
}
