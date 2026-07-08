import {
  generateId,
  readCollection,
  slugify,
  writeCollection,
} from "@/lib/content-store";
import type { Course } from "@/types/content";

const FILE = "courses.json";

export async function getCourses(): Promise<Course[]> {
  const courses = await readCollection<Course>(FILE);
  return courses.sort((a, b) => a.orderIndex - b.orderIndex);
}

export async function getPublishedCourses(): Promise<Course[]> {
  const courses = await getCourses();
  return courses.filter((course) => course.published);
}

export async function getCourseById(id: string): Promise<Course | null> {
  const courses = await getCourses();
  return courses.find((course) => course.id === id) ?? null;
}

export type CourseInput = Omit<Course, "id" | "slug" | "orderIndex"> & {
  slug?: string;
};

export async function createCourse(input: CourseInput): Promise<Course> {
  const courses = await readCollection<Course>(FILE);
  const course: Course = {
    ...input,
    id: generateId("curso"),
    slug: input.slug || slugify(input.title),
    orderIndex: courses.length
      ? Math.max(...courses.map((c) => c.orderIndex)) + 1
      : 1,
  };
  await writeCollection(FILE, [...courses, course]);
  return course;
}

export async function updateCourse(
  id: string,
  input: CourseInput,
): Promise<Course | null> {
  const courses = await readCollection<Course>(FILE);
  const index = courses.findIndex((course) => course.id === id);
  if (index === -1) return null;
  const updated: Course = {
    ...courses[index],
    ...input,
    slug: input.slug || slugify(input.title),
  };
  courses[index] = updated;
  await writeCollection(FILE, courses);
  return updated;
}

export async function deleteCourse(id: string): Promise<void> {
  const courses = await readCollection<Course>(FILE);
  await writeCollection(
    FILE,
    courses.filter((course) => course.id !== id),
  );
}

export async function toggleCoursePublished(id: string): Promise<Course | null> {
  const courses = await readCollection<Course>(FILE);
  const index = courses.findIndex((course) => course.id === id);
  if (index === -1) return null;
  courses[index] = { ...courses[index], published: !courses[index].published };
  await writeCollection(FILE, courses);
  return courses[index];
}
