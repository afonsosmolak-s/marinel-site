import { Container } from "@/components/layout/container";
import { MediaPlaceholder } from "@/components/media-placeholder";
import { LinkButton } from "@/components/ui/link-button";
import { Reveal } from "@/components/motion/reveal";
import type { SiteSettings } from "@/types/content";

export function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-36 pb-20 md:pt-48 md:pb-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 0%, var(--pink-tint), transparent 70%)",
        }}
      />
      <Container>
        <div className="grid items-center gap-14 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
          <Reveal>
            <p className="flex items-center gap-2 text-xs font-medium tracking-[0.2em] text-brown uppercase">
              {settings.heroEyebrow}
            </p>
            <h1 className="mt-6 text-balance font-heading text-5xl leading-[1.08] font-medium text-foreground md:text-7xl">
              {settings.heroTitle}{" "}
              <em className="text-pink-ink italic">
                {settings.heroTitleAccent}
              </em>
              .
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
              {settings.heroSubtitle}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <LinkButton
                href="#cursos"
                className="btn-sweep h-auto rounded-full bg-primary px-7 py-3.5 text-base text-primary-foreground hover:bg-primary/85"
              >
                Descubre los cursos
              </LinkButton>
              <LinkButton
                href={settings.whatsappUrl}
                external
                variant="outline"
                className="h-auto rounded-full px-7 py-3.5 text-base hover:bg-pink-tint hover:text-pink-ink"
              >
                Hablar por WhatsApp
              </LinkButton>
            </div>
          </Reveal>
          <Reveal delay={0.15} image>
            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-10 -z-10 blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(226,170,183,.18), transparent 70%)",
                }}
              />
              <MediaPlaceholder
                src={settings.heroImageUrl}
                position={settings.heroImagePosition}
                alt="Marinel, chef pastelera"
                ratio="portrait"
                tone="pink"
                caption="Foto de Marinel"
                className="mx-auto max-w-sm shadow-[4px_4px_10px_rgba(0,0,0,0.18),_10px_10px_30px_rgba(0,0,0,0.10)] md:ml-auto"
                priority
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
