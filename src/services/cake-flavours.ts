import { createAdminClient, createPublicClient } from "@/lib/supabase/server";
import type { CakeFlavour } from "@/types/content";

type Row = {
  id: string;
  name: string;
  image_url: string | null;
  order_index: number;
  published: boolean;
};

function toModel(row: Row): CakeFlavour {
  return {
    id: row.id,
    name: row.name,
    imageUrl: row.image_url,
    orderIndex: row.order_index,
    published: row.published,
  };
}

export async function getCakeFlavours(): Promise<CakeFlavour[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("cake_flavours")
    .select("*")
    .order("order_index");
  if (error) throw error;
  return (data as Row[]).map(toModel);
}

export async function getPublishedCakeFlavours(): Promise<CakeFlavour[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("cake_flavours")
      .select("*")
      .eq("published", true)
      .order("order_index");
    if (error || !data) return [];
    return (data as Row[]).map(toModel);
  } catch {
    return [];
  }
}

export type CakeFlavourInput = Omit<CakeFlavour, "id" | "orderIndex">;

export async function createCakeFlavour(input: CakeFlavourInput): Promise<CakeFlavour> {
  const supabase = createAdminClient();
  const { data: last } = await supabase
    .from("cake_flavours")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .single();
  const orderIndex = last ? (last as { order_index: number }).order_index + 1 : 1;
  const { data, error } = await supabase
    .from("cake_flavours")
    .insert({
      name: input.name,
      published: input.published,
      image_url: input.imageUrl,
      order_index: orderIndex,
    })
    .select()
    .single();
  if (error) throw error;
  return toModel(data as Row);
}

export async function updateCakeFlavour(id: string, input: CakeFlavourInput): Promise<CakeFlavour | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("cake_flavours")
    .update({ name: input.name, published: input.published, image_url: input.imageUrl })
    .eq("id", id)
    .select()
    .single();
  if (error) return null;
  return toModel(data as Row);
}

export async function deleteCakeFlavour(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("cake_flavours").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleCakeFlavourPublished(id: string): Promise<CakeFlavour | null> {
  const supabase = createAdminClient();
  const { data: current } = await supabase
    .from("cake_flavours")
    .select("published")
    .eq("id", id)
    .single();
  if (!current) return null;
  const { data, error } = await supabase
    .from("cake_flavours")
    .update({ published: !(current as { published: boolean }).published })
    .eq("id", id)
    .select()
    .single();
  if (error) return null;
  return toModel(data as Row);
}

export async function reorderCakeFlavours(orderedIds: string[]): Promise<void> {
  const supabase = createAdminClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("cake_flavours").update({ order_index: index + 1 }).eq("id", id),
    ),
  );
}
