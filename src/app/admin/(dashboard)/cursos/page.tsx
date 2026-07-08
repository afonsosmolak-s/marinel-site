import { PageHeader } from "@/components/admin/page-header";
import { CoursesTable } from "@/components/admin/courses-table";
import { LinkButton } from "@/components/ui/link-button";
import { getCourses } from "@/services/courses";

export default async function AdminCoursesPage() {
  const courses = await getCourses();

  return (
    <div>
      <PageHeader
        title="Cursos"
        description="Gestiona los cursos que se muestran en la web."
        action={
          <LinkButton
            href="/admin/cursos/nuevo"
            className="h-auto rounded-full bg-foreground px-5 py-2.5 text-primary-foreground hover:bg-foreground/85"
          >
            + Nuevo curso
          </LinkButton>
        }
      />
      <CoursesTable courses={courses} />
    </div>
  );
}
