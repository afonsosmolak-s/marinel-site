import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { getTestimonialById } from "@/services/testimonials";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await getTestimonialById(id);
  if (!testimonial) notFound();

  return (
    <div>
      <PageHeader title={testimonial.authorName} />
      <TestimonialForm testimonial={testimonial} />
    </div>
  );
}
