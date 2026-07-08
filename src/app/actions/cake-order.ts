"use server";

import { cakeOrderSchema } from "@/lib/validations/cake-order";
import { createCakeOrder } from "@/services/cake-orders";

export async function submitCakeOrder(
  input: unknown,
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = cakeOrderSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Revisa los datos del formulario.",
    };
  }
  await createCakeOrder(parsed.data);
  return { success: true };
}
