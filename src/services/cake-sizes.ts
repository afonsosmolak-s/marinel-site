import {
  generateId,
  readCollection,
  writeCollection,
} from "@/lib/content-store";
import type { CakeSize } from "@/types/content";

const FILE = "cake-sizes.json";

export async function getCakeSizes(): Promise<CakeSize[]> {
  const items = await readCollection<CakeSize>(FILE);
  return items.sort((a, b) => a.orderIndex - b.orderIndex);
}

export async function getPublishedCakeSizes(): Promise<CakeSize[]> {
  const items = await getCakeSizes();
  return items.filter((item) => item.published);
}

export type CakeSizeInput = Omit<CakeSize, "id" | "orderIndex">;

export async function createCakeSize(input: CakeSizeInput): Promise<CakeSize> {
  const items = await readCollection<CakeSize>(FILE);
  const size: CakeSize = {
    ...input,
    id: generateId("tamano"),
    orderIndex: items.length
      ? Math.max(...items.map((i) => i.orderIndex)) + 1
      : 1,
  };
  await writeCollection(FILE, [...items, size]);
  return size;
}

export async function updateCakeSize(
  id: string,
  input: CakeSizeInput,
): Promise<CakeSize | null> {
  const items = await readCollection<CakeSize>(FILE);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...input };
  await writeCollection(FILE, items);
  return items[index];
}

export async function deleteCakeSize(id: string): Promise<void> {
  const items = await readCollection<CakeSize>(FILE);
  await writeCollection(
    FILE,
    items.filter((item) => item.id !== id),
  );
}

export async function toggleCakeSizePublished(
  id: string,
): Promise<CakeSize | null> {
  const items = await readCollection<CakeSize>(FILE);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], published: !items[index].published };
  await writeCollection(FILE, items);
  return items[index];
}

export async function reorderCakeSizes(orderedIds: string[]): Promise<void> {
  const items = await readCollection<CakeSize>(FILE);
  const byId = new Map(items.map((item) => [item.id, item]));
  const reordered = orderedIds
    .map((id, index) => {
      const item = byId.get(id);
      return item ? { ...item, orderIndex: index + 1 } : null;
    })
    .filter((item): item is CakeSize => item !== null);
  await writeCollection(FILE, reordered);
}
