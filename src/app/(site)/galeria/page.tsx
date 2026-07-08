import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Container } from "@/components/layout/container";
import { GalleryFull } from "@/components/sections/gallery-full";
import { Reveal } from "@/components/motion/reveal";
import { getSiteSettings } from "@/services/settings";
import { getPublishedGalleryImages } from "@/services/gallery";

export const metadata: Metadata = {
  title: "Galería",
  description:
    "Tartas personalizadas, detalles y momentos del obrador de Marinel Pastelería.",
};

export default async function GaleriaPage({
  searchParams,
}: {
  searchParams: Promise<{ foto?: string }>;
}) {
  const [settings, images, params] = await Promise.all([
    getSiteSettings(),
    getPublishedGalleryImages(),
    searchParams,
  ]);

  return (
    <>
      <SiteHeader whatsappUrl={settings.whatsappUrl} />
      <main className="pt-36 pb-24 md:pt-48 md:pb-36">
        <Container>
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <p className="text-xs font-medium tracking-[0.2em] text-brown uppercase">
              Galería completa
            </p>
            <h1 className="mt-4 text-balance font-heading text-4xl leading-[1.1] font-medium text-foreground md:text-6xl">
              Cada creación,{" "}
              <em className="text-pink-ink italic">en detalle.</em>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              Una colección de tartas, detalles y momentos del obrador.
            </p>
          </Reveal>

          <GalleryFull images={images} initialId={params.foto} />
        </Container>
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
