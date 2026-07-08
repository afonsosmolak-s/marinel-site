import { PageHeader } from "@/components/admin/page-header";
import { CourseForm } from "@/components/admin/course-form";

export default function NewCoursePage() {
  return (
    <div>
      <PageHeader title="Nuevo curso" />
      <CourseForm />
    </div>
  );
}
