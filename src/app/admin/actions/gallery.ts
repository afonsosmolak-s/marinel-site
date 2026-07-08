"use server";

import { revalidatePath } from "next/cache";
import { galleryImageSchema } from "@/lib/validations/gallery";
import * as galleryService from "@/services/gallery";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/galeria");
}

export async function createGalleryImageAction(
  input: unknown,
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = galleryImageSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Revisa los datos de la imagen." };
  }
  await galleryService.createGalleryImage(parsed.data);
  revalidate();
  return { success: true };
}

export async function updateGalleryImageAction(
  id: string,
  input: unknown,
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = galleryImageSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Revisa los datos de la imagen." };
  }
  await galleryService.updateGalleryImage(id, parsed.data);
  revalidate();
  return { success: true };
}

export async function deleteGalleryImageAction(id: string): Promise<void> {
  await galleryService.deleteGalleryImage(id);
  revalidate();
}

export async function toggleGalleryImagePublishedAction(
  id: string,
): Promise<void> {
  await galleryService.toggleGalleryImagePublished(id);
  revalidate();
}

export async function reorderGalleryImagesAction(
  orderedIds: string[],
): Promise<void> {
  await galleryService.reorderGalleryImages(orderedIds);
  revalidate();
}
