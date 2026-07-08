import {
  generateId,
  readCollection,
  writeCollection,
} from "@/lib/content-store";
import type { CakeStyle } from "@/types/content";

const FILE = "cake-styles.json";

export async function getCakeStyles(): Promise<CakeStyle[]> {
  const items = await readCollection<CakeStyle>(FILE);
  return items.sort((a, b) => a.orderIndex - b.orderIndex);
}

export async function getPublishedCakeStyles(): Promise<CakeStyle[]> {
  const items = await getCakeStyles();
  return items.filter((item) => item.published);
}

export type CakeStyleInput = Omit<CakeStyle, "id" | "orderIndex">;

export async function createCakeStyle(
  input: CakeStyleInput,
): Promise<CakeStyle> {
  const items = await readCollection<CakeStyle>(FILE);
  const style: CakeStyle = {
    ...input,
    id: generateId("estilo"),
    orderIndex: items.length
      ? Math.max(...items.map((i) => i.orderIndex)) + 1
      : 1,
  };
  await writeCollection(FILE, [...items, style]);
  return style;
}

export async function updateCakeStyle(
  id: string,
  input: CakeStyleInput,
): Promise<CakeStyle | null> {
  const items = await readCollection<CakeStyle>(FILE);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...input };
  await writeCollection(FILE, items);
  return items[index];
}

export async function deleteCakeStyle(id: string): Promise<void> {
  const items = await readCollection<CakeStyle>(FILE);
  await writeCollection(
    FILE,
    items.filter((item) => item.id !== id),
  );
}

export async function toggleCakeStylePublished(
  id: string,
): Promise<CakeStyle | null> {
  const items = await readCollection<CakeStyle>(FILE);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], published: !items[index].published };
  await writeCollection(FILE, items);
  return items[index];
}

export async function reorderCakeStyles(orderedIds: string[]): Promise<void> {
  const items = await readCollection<CakeStyle>(FILE);
  const byId = new Map(items.map((item) => [item.id, item]));
  const reordered = orderedIds
    .map((id, index) => {
      const item = byId.get(id);
      return item ? { ...item, orderIndex: index + 1 } : null;
    })
    .filter((item): item is CakeStyle => item !== null);
  await writeCollection(FILE, reordered);
}
