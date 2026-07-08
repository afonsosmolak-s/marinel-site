import { PageHeader } from "@/components/admin/page-header";
import { TestimonialForm } from "@/components/admin/testimonial-form";

export default function NewTestimonialPage() {
  return (
    <div>
      <PageHeader title="Nuevo testimonio" />
      <TestimonialForm />
    </div>
  );
}
