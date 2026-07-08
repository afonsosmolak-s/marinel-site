"use server";

import { revalidatePath } from "next/cache";
import { courseSchema } from "@/lib/validations/course";
import * as coursesService from "@/services/courses";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/cursos");
}

export async function createCourseAction(
  input: unknown,
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = courseSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Revisa los datos del curso." };
  }
  await coursesService.createCourse(parsed.data);
  revalidate();
  return { success: true };
}

export async function updateCourseAction(
  id: string,
  input: unknown,
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = courseSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Revisa los datos del curso." };
  }
  await coursesService.updateCourse(id, parsed.data);
  revalidate();
  return { success: true };
}

export async function deleteCourseAction(id: string): Promise<void> {
  await coursesService.deleteCourse(id);
  revalidate();
}

export async function toggleCoursePublishedAction(id: string): Promise<void> {
  await coursesService.toggleCoursePublished(id);
  revalidate();
}
