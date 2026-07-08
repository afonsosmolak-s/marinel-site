import {
  generateId,
  readCollection,
  writeCollection,
} from "@/lib/content-store";
import type { CakeOccasion } from "@/types/content";

const FILE = "cake-occasions.json";

export async function getCakeOccasions(): Promise<CakeOccasion[]> {
  const items = await readCollection<CakeOccasion>(FILE);
  return items.sort((a, b) => a.orderIndex - b.orderIndex);
}

export async function getPublishedCakeOccasions(): Promise<CakeOccasion[]> {
  const items = await getCakeOccasions();
  return items.filter((item) => item.published);
}

export type CakeOccasionInput = Omit<CakeOccasion, "id" | "orderIndex">;

export async function createCakeOccasion(
  input: CakeOccasionInput,
): Promise<CakeOccasion> {
  const items = await readCollection<CakeOccasion>(FILE);
  const occasion: CakeOccasion = {
    ...input,
    id: generateId("ocasion"),
    orderIndex: items.length
      ? Math.max(...items.map((i) => i.orderIndex)) + 1
      : 1,
  };
  await writeCollection(FILE, [...items, occasion]);
  return occasion;
}

export async function updateCakeOccasion(
  id: string,
  input: CakeOccasionInput,
): Promise<CakeOccasion | null> {
  const items = await readCollection<CakeOccasion>(FILE);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...input };
  await writeCollection(FILE, items);
  return items[index];
}

export async function deleteCakeOccasion(id: string): Promise<void> {
  const items = await readCollection<CakeOccasion>(FILE);
  await writeCollection(
    FILE,
    items.filter((item) => item.id !== id),
  );
}

export async function toggleCakeOccasionPublished(
  id: string,
): Promise<CakeOccasion | null> {
  const items = await readCollection<CakeOccasion>(FILE);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], published: !items[index].published };
  await writeCollection(FILE, items);
  return items[index];
}

export async function reorderCakeOccasions(
  orderedIds: string[],
): Promise<void> {
  const items = await readCollection<CakeOccasion>(FILE);
  const byId = new Map(items.map((item) => [item.id, item]));
  const reordered = orderedIds
    .map((id, index) => {
      const item = byId.get(id);
      return item ? { ...item, orderIndex: index + 1 } : null;
    })
    .filter((item): item is CakeOccasion => item !== null);
  await writeCollection(FILE, reordered);
}
