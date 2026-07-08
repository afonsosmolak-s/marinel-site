import {
  generateId,
  readCollection,
  writeCollection,
} from "@/lib/content-store";
import type { Lead, LeadStatus } from "@/types/content";

const FILE = "leads.json";

export async function getLeads(): Promise<Lead[]> {
  const items = await readCollection<Lead>(FILE);
  return items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export type LeadInput = Omit<Lead, "id" | "status" | "createdAt">;

export async function createLead(input: LeadInput): Promise<Lead> {
  const items = await readCollection<Lead>(FILE);
  const lead: Lead = {
    ...input,
    id: generateId("lead"),
    status: "nuevo",
    createdAt: new Date().toISOString(),
  };
  await writeCollection(FILE, [...items, lead]);
  return lead;
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
): Promise<Lead | null> {
  const items = await readCollection<Lead>(FILE);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], status };
  await writeCollection(FILE, items);
  return items[index];
}

export async function deleteLead(id: string): Promise<void> {
  const items = await readCollection<Lead>(FILE);
  await writeCollection(
    FILE,
    items.filter((item) => item.id !== id),
  );
}
