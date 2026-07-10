"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import * as leadsService from "@/services/leads";
import type { LeadStatus } from "@/types/content";

export async function updateLeadStatusAction(
  id: string,
  status: LeadStatus,
): Promise<void> {
  await requireAdmin();
  await leadsService.updateLeadStatus(id, status);
  revalidatePath("/admin/formularios");
  revalidatePath("/admin/dashboard");
}

export async function deleteLeadAction(id: string): Promise<void> {
  await requireAdmin();
  await leadsService.deleteLead(id);
  revalidatePath("/admin/formularios");
  revalidatePath("/admin/dashboard");
}
