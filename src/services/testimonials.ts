import {
  generateId,
  readCollection,
  writeCollection,
} from "@/lib/content-store";
import type { Testimonial } from "@/types/content";

const FILE = "testimonials.json";

export async function getTestimonials(): Promise<Testimonial[]> {
  const items = await readCollection<Testimonial>(FILE);
  return items.sort((a, b) => a.orderIndex - b.orderIndex);
}

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  const items = await getTestimonials();
  return items.filter((item) => item.published);
}

export async function getTestimonialById(
  id: string,
): Promise<Testimonial | null> {
  const items = await getTestimonials();
  return items.find((item) => item.id === id) ?? null;
}

export type TestimonialInput = Omit<Testimonial, "id" | "orderIndex">;

export async function createTestimonial(
  input: TestimonialInput,
): Promise<Testimonial> {
  const items = await readCollection<Testimonial>(FILE);
  const testimonial: Testimonial = {
    ...input,
    id: generateId("testimonio"),
    orderIndex: items.length
      ? Math.max(...items.map((i) => i.orderIndex)) + 1
      : 1,
  };
  await writeCollection(FILE, [...items, testimonial]);
  return testimonial;
}

export async function updateTestimonial(
  id: string,
  input: TestimonialInput,
): Promise<Testimonial | null> {
  const items = await readCollection<Testimonial>(FILE);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...input };
  await writeCollection(FILE, items);
  return items[index];
}

export async function deleteTestimonial(id: string): Promise<void> {
  const items = await readCollection<Testimonial>(FILE);
  await writeCollection(
    FILE,
    items.filter((item) => item.id !== id),
  );
}

export async function toggleTestimonialPublished(
  id: string,
): Promise<Testimonial | null> {
  const items = await readCollection<Testimonial>(FILE);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], published: !items[index].published };
  await writeCollection(FILE, items);
  return items[index];
}
