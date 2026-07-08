import { PageHeader } from "@/components/admin/page-header";
import { TestimonialsTable } from "@/components/admin/testimonials-table";
import { LinkButton } from "@/components/ui/link-button";
import { getTestimonials } from "@/services/testimonials";

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div>
      <PageHeader
        title="Testimonios"
        description="Gestiona las opiniones de alumnas y clientas."
        action={
          <LinkButton
            href="/admin/testimonios/nuevo"
            className="h-auto rounded-full bg-foreground px-5 py-2.5 text-primary-foreground hover:bg-foreground/85"
          >
            + Nuevo testimonio
          </LinkButton>
        }
      />
      <TestimonialsTable testimonials={testimonials} />
    </div>
  );
}
