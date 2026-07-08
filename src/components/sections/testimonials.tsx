import { Container } from "@/components/layout/container";
import { SectionEyebrow } from "@/components/layout/section-eyebrow";
import { SectionHeading } from "@/components/layout/section-heading";
import { MediaPlaceholder } from "@/components/media-placeholder";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group";
import type { Testimonial } from "@/types/content";

export function Testimonials({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  return (
    <section id="opiniones" className="py-24 md:py-36">
      <Container>
        <Reveal>
          <SectionEyebrow index="06" label="Opiniones" className="mb-6" />
          <SectionHeading
            title="Lo que cuentan"
            accent="las alumnas."
            accentColor="pink"
            align="center"
            className="mx-auto max-w-2xl"
          />
        </Reveal>

        <StaggerGroup className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.id}>
              <div className="group relative h-full">
              <figure className="relative flex h-full flex-col rounded-3xl border border-border bg-warm p-8 shadow-[4px_4px_10px_rgba(0,0,0,0.18),_10px_10px_30px_rgba(0,0,0,0.10)] transition-[transform,box-shadow] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5 group-hover:shadow-[6px_6px_14px_rgba(0,0,0,0.22),_14px_14px_40px_rgba(0,0,0,0.14)]">
                <span
                  aria-hidden
                  className="font-heading text-4xl leading-none text-brown/40 italic"
                >
                  &ldquo;
                </span>
                <blockquote className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-foreground">
                  {testimonial.content}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <MediaPlaceholder
                    src={testimonial.avatarUrl}
                    position={testimonial.imagePosition}
                    alt={testimonial.authorName}
                    ratio="square"
                    tone="pink"
                    className="size-10 shrink-0 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {testimonial.authorName}
                    </p>
                    {testimonial.authorRole && (
                      <p className="text-xs text-muted-foreground">
                        {testimonial.authorRole}
                      </p>
                    )}
                  </div>
                </figcaption>
              </figure>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
}
