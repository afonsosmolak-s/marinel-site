"use server";

import { revalidatePath } from "next/cache";
import { testimonialSchema } from "@/lib/validations/testimonial";
import * as testimonialsService from "@/services/testimonials";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/testimonios");
}

export async function createTestimonialAction(
  input: unknown,
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Revisa los datos del testimonio." };
  }
  await testimonialsService.createTestimonial(parsed.data);
  revalidate();
  return { success: true };
}

export async function updateTestimonialAction(
  id: string,
  input: unknown,
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Revisa los datos del testimonio." };
  }
  await testimonialsService.updateTestimonial(id, parsed.data);
  revalidate();
  return { success: true };
}

export async function deleteTestimonialAction(id: string): Promise<void> {
  await testimonialsService.deleteTestimonial(id);
  revalidate();
}

export async function toggleTestimonialPublishedAction(
  id: string,
): Promise<void> {
  await testimonialsService.toggleTestimonialPublished(id);
  revalidate();
}
