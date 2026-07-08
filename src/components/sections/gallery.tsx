import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SectionEyebrow } from "@/components/layout/section-eyebrow";
import { SectionHeading } from "@/components/layout/section-heading";
import { MediaPlaceholder } from "@/components/media-placeholder";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/types/content";

const PREVIEW_COUNT = 4;

export function Gallery({ images }: { images: GalleryImage[] }) {
  const preview = images.slice(0, PREVIEW_COUNT);

  return (
    <section id="galeria" className="py-24 md:py-36">
      <Container>
        <Reveal>
          <SectionEyebrow index="03" label="Galería" className="mb-6" />
          <SectionHeading
            title="Un vistazo a"
            accent="cada creación."
            accentColor="pink"
            description="Una selección de tartas, detalles y momentos del obrador."
          />
        </Reveal>

        <StaggerGroup className="mt-14 grid grid-cols-2 gap-8 md:gap-12 lg:grid-cols-4">
          {preview.map((image) => (
            <StaggerItem key={image.id}>
              <div className="group relative">
                <Link
                  href={`/galeria?foto=${image.id}`}
                  className="relative block w-full text-left transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5"
                  aria-label={image.caption ?? "Ver fotografía"}
                >
                  <MediaPlaceholder
                    src={image.imageUrl}
                    position={image.imagePosition}
                    alt={image.caption ?? "Fotografía de Marinel Pastelería"}
                    ratio="tall"
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="shadow-[4px_4px_10px_rgba(0,0,0,0.18),_10px_10px_30px_rgba(0,0,0,0.10)] transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:shadow-[6px_6px_14px_rgba(0,0,0,0.22),_14px_14px_40px_rgba(0,0,0,0.14)]"
                    imageClassName="brightness-[0.68] transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] group-hover:brightness-[1.07] group-hover:saturate-[1.03]"
                  />
                </Link>
                {image.featured && (
                  <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-pink px-3 py-1 text-[0.65rem] font-medium tracking-wide text-foreground uppercase">
                    Destacado
                  </span>
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <Reveal className="mt-14 flex justify-center">
          <Link
            href="/galeria"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-auto rounded-full px-7 py-3 hover:bg-pink-tint hover:text-pink-ink",
            )}
          >
            Explorar galería completa
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
