import { Container } from "@/components/layout/container";
import { SectionEyebrow } from "@/components/layout/section-eyebrow";
import { SectionHeading } from "@/components/layout/section-heading";
import { MediaPlaceholder } from "@/components/media-placeholder";
import { Reveal } from "@/components/motion/reveal";
import type { SiteSettings } from "@/types/content";

export function About({ settings }: { settings: SiteSettings }) {
  return (
    <section id="sobre" className="bg-section-a py-24 md:py-36">
      <Container>
        <div className="grid gap-14 md:grid-cols-[0.85fr_1.15fr] md:gap-20">
          <Reveal image>
            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-12 -z-10 blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(226,170,183,.16), transparent 70%)",
                }}
              />
              <MediaPlaceholder
                src={settings.aboutImageUrl}
                position={settings.aboutImagePosition}
                alt="Retrato de Marinel en el obrador"
                ratio="portrait"
                tone="warm"
                caption="Retrato de Marinel"
                className="max-w-sm shadow-[4px_4px_10px_rgba(0,0,0,0.18),_10px_10px_30px_rgba(0,0,0,0.10)]"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <SectionEyebrow index="02" label="Sobre Marinel" className="mb-6" />
            <SectionHeading
              title={settings.aboutTitle}
              accent={settings.aboutTitleAccent}
              accentColor="brown"
            />
            <div className="mt-6 max-w-xl space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              {settings.aboutBody.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
