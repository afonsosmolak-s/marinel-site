import { createAdminClient, createPublicClient } from "@/lib/supabase/server";
import type { CakeFilling } from "@/types/content";

type Row = {
  id: string;
  name: string;
  image_url: string | null;
  order_index: number;
  published: boolean;
};

function toModel(row: Row): CakeFilling {
  return {
    id: row.id,
    name: row.name,
    imageUrl: row.image_url,
    orderIndex: row.order_index,
    published: row.published,
  };
}

export async function getCakeFillings(): Promise<CakeFilling[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("cake_fillings")
    .select("*")
    .order("order_index");
  if (error) throw error;
  return (data as Row[]).map(toModel);
}

export async function getPublishedCakeFillings(): Promise<CakeFilling[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("cake_fillings")
      .select("*")
      .eq("published", true)
      .order("order_index");
    if (error || !data) return [];
    return (data as Row[]).map(toModel);
  } catch {
    return [];
  }
}

export type CakeFillingInput = Omit<CakeFilling, "id" | "orderIndex">;

export async function createCakeFilling(input: CakeFillingInput): Promise<CakeFilling> {
  const supabase = createAdminClient();
  const { data: last } = await supabase
    .from("cake_fillings")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .single();
  const orderIndex = last ? (last as { order_index: number }).order_index + 1 : 1;
  const { data, error } = await supabase
    .from("cake_fillings")
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

export async function updateCakeFilling(id: string, input: CakeFillingInput): Promise<CakeFilling | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("cake_fillings")
    .update({ name: input.name, published: input.published, image_url: input.imageUrl })
    .eq("id", id)
    .select()
    .single();
  if (error) return null;
  return toModel(data as Row);
}

export async function deleteCakeFilling(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("cake_fillings").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleCakeFillingPublished(id: string): Promise<CakeFilling | null> {
  const supabase = createAdminClient();
  const { data: current } = await supabase
    .from("cake_fillings")
    .select("published")
    .eq("id", id)
    .single();
  if (!current) return null;
  const { data, error } = await supabase
    .from("cake_fillings")
    .update({ published: !(current as { published: boolean }).published })
    .eq("id", id)
    .select()
    .single();
  if (error) return null;
  return toModel(data as Row);
}

export async function reorderCakeFillings(orderedIds: string[]): Promise<void> {
  const supabase = createAdminClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("cake_fillings").update({ order_index: index + 1 }).eq("id", id),
    ),
  );
}
