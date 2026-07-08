import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { CourseForm } from "@/components/admin/course-form";
import { getCourseById } from "@/services/courses";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getCourseById(id);
  if (!course) notFound();

  return (
    <div>
      <PageHeader title={course.title} />
      <CourseForm course={course} />
    </div>
  );
}
