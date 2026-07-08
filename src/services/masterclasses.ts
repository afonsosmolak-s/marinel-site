import {
  generateId,
  readCollection,
  writeCollection,
} from "@/lib/content-store";
import type { Masterclass } from "@/types/content";

const FILE = "masterclasses.json";

export async function getMasterclasses(): Promise<Masterclass[]> {
  const items = await readCollection<Masterclass>(FILE);
  return items.sort((a, b) => a.orderIndex - b.orderIndex);
}

export async function getPublishedMasterclasses(): Promise<Masterclass[]> {
  const items = await getMasterclasses();
  return items.filter((item) => item.published);
}

export async function getMasterclassById(
  id: string,
): Promise<Masterclass | null> {
  const items = await getMasterclasses();
  return items.find((item) => item.id === id) ?? null;
}

export type MasterclassInput = Omit<Masterclass, "id" | "orderIndex">;

export async function createMasterclass(
  input: MasterclassInput,
): Promise<Masterclass> {
  const items = await readCollection<Masterclass>(FILE);
  const masterclass: Masterclass = {
    ...input,
    id: generateId("masterclass"),
    orderIndex: items.length
      ? Math.max(...items.map((i) => i.orderIndex)) + 1
      : 1,
  };
  await writeCollection(FILE, [...items, masterclass]);
  return masterclass;
}

export async function updateMasterclass(
  id: string,
  input: MasterclassInput,
): Promise<Masterclass | null> {
  const items = await readCollection<Masterclass>(FILE);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...input };
  await writeCollection(FILE, items);
  return items[index];
}

export async function deleteMasterclass(id: string): Promise<void> {
  const items = await readCollection<Masterclass>(FILE);
  await writeCollection(
    FILE,
    items.filter((item) => item.id !== id),
  );
}

export async function toggleMasterclassPublished(
  id: string,
): Promise<Masterclass | null> {
  const items = await readCollection<Masterclass>(FILE);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], published: !items[index].published };
  await writeCollection(FILE, items);
  return items[index];
}
