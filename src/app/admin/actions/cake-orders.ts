"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import * as cakeOrdersService from "@/services/cake-orders";
import type { CakeOrderStatus } from "@/types/content";

export async function updateCakeOrderStatusAction(
  id: string,
  status: CakeOrderStatus,
): Promise<void> {
  await requireAdmin();
  await cakeOrdersService.updateCakeOrderStatus(id, status);
  revalidatePath("/admin/pedidos");
  revalidatePath("/admin/dashboard");
}

export async function deleteCakeOrderAction(id: string): Promise<void> {
  await requireAdmin();
  await cakeOrdersService.deleteCakeOrder(id);
  revalidatePath("/admin/pedidos");
  revalidatePath("/admin/dashboard");
}
