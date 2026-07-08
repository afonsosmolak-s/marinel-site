import {
  generateId,
  readCollection,
  writeCollection,
} from "@/lib/content-store";
import type { CakeOrder, CakeOrderStatus } from "@/types/content";

const FILE = "cake-orders.json";

export async function getCakeOrders(): Promise<CakeOrder[]> {
  const items = await readCollection<CakeOrder>(FILE);
  return items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export type CakeOrderInput = Omit<CakeOrder, "id" | "status" | "createdAt">;

export async function createCakeOrder(
  input: CakeOrderInput,
): Promise<CakeOrder> {
  const items = await readCollection<CakeOrder>(FILE);
  const order: CakeOrder = {
    ...input,
    id: generateId("order"),
    status: "pendiente",
    createdAt: new Date().toISOString(),
  };
  await writeCollection(FILE, [...items, order]);
  return order;
}

export async function updateCakeOrderStatus(
  id: string,
  status: CakeOrderStatus,
): Promise<CakeOrder | null> {
  const items = await readCollection<CakeOrder>(FILE);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], status };
  await writeCollection(FILE, items);
  return items[index];
}

export async function deleteCakeOrder(id: string): Promise<void> {
  const items = await readCollection<CakeOrder>(FILE);
  await writeCollection(
    FILE,
    items.filter((item) => item.id !== id),
  );
}
