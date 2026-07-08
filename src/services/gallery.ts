import {
  generateId,
  readCollection,
  writeCollection,
} from "@/lib/content-store";
import type { GalleryImage } from "@/types/content";

const FILE = "gallery.json";

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const items = await readCollection<GalleryImage>(FILE);
  return items.sort((a, b) => a.orderIndex - b.orderIndex);
}

export async function getPublishedGalleryImages(): Promise<GalleryImage[]> {
  const items = await getGalleryImages();
  return items.filter((item) => item.published);
}

export type GalleryImageInput = Omit<GalleryImage, "id" | "orderIndex">;

export async function createGalleryImage(
  input: GalleryImageInput,
): Promise<GalleryImage> {
  const items = await readCollection<GalleryImage>(FILE);
  const image: GalleryImage = {
    ...input,
    id: generateId("galeria"),
    orderIndex: items.length
      ? Math.max(...items.map((i) => i.orderIndex)) + 1
      : 1,
  };
  await writeCollection(FILE, [...items, image]);
  return image;
}

export async function updateGalleryImage(
  id: string,
  input: GalleryImageInput,
): Promise<GalleryImage | null> {
  const items = await readCollection<GalleryImage>(FILE);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...input };
  await writeCollection(FILE, items);
  return items[index];
}

export async function deleteGalleryImage(id: string): Promise<void> {
  const items = await readCollection<GalleryImage>(FILE);
  await writeCollection(
    FILE,
    items.filter((item) => item.id !== id),
  );
}

export async function toggleGalleryImagePublished(
  id: string,
): Promise<GalleryImage | null> {
  const items = await readCollection<GalleryImage>(FILE);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], published: !items[index].published };
  await writeCollection(FILE, items);
  return items[index];
}

export async function reorderGalleryImages(
  orderedIds: string[],
): Promise<void> {
  const items = await readCollection<GalleryImage>(FILE);
  const byId = new Map(items.map((item) => [item.id, item]));
  const reordered = orderedIds
    .map((id, index) => {
      const item = byId.get(id);
      return item ? { ...item, orderIndex: index + 1 } : null;
    })
    .filter((item): item is GalleryImage => item !== null);
  await writeCollection(FILE, reordered);
}
