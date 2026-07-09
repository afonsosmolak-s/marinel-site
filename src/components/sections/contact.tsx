import { Mail, MessageCircle } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionEyebrow } from "@/components/layout/section-eyebrow";
import { SectionHeading } from "@/components/layout/section-heading";
import { LeadForm } from "@/components/forms/lead-form";
import { Reveal } from "@/components/motion/reveal";
import type { Course, Masterclass, SiteSettings } from "@/types/content";

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Contact({
  settings,
  courses,
  masterclasses,
  defaultCourse,
}: {
  settings: SiteSettings;
  courses: Course[];
  masterclasses: Masterclass[];
  defaultCourse?: string;
}) {
  const quickContacts = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: settings.whatsappNumber,
      href: settings.whatsappUrl,
    },
    {
      icon: Mail,
      label: "Email",
      value: settings.email,
      href: `mailto:${settings.email}`,
    },
    {
      icon: InstagramIcon,
      label: "Instagram",
      value: "@tartasmarinel",
      href: settings.instagramUrl,
    },
  ];

  return (
    <section id="contacto" className="bg-section-a py-24 md:py-36">
      <Container>
        <div className="grid gap-14 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <Reveal>
            <SectionEyebrow index="07" label="Contacto" className="mb-6" />
            <SectionHeading
              title="Cuéntanos qué te"
              accent="gustaría aprender."
              accentColor="pink"
              description="Completa el formulario y Marinel revisará tu nivel y objetivo para proponerte el curso ideal. El pago (Bizum o transferencia) se acuerda directamente con ella."
            />
            <div className="mt-10 flex flex-col gap-4">
              {quickContacts.map((contact) => (
                <a
                  key={contact.label}
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-border bg-background px-5 py-4 transition-colors hover:border-pink"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-pink-tint text-pink-ink">
                    <contact.icon className="size-4.5" strokeWidth={1.5} />
                  </span>
                  <span>
                    <span className="block text-xs text-muted-foreground">
                      {contact.label}
                    </span>
                    <span className="block text-sm font-medium text-foreground">
                      {contact.value}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-border bg-background p-6 md:p-10">
              <h3 className="form-title mb-8 text-center font-heading text-2xl font-medium text-foreground italic md:text-3xl">
                Reserva tu plaza
              </h3>
              <LeadForm
                courses={courses}
                masterclasses={masterclasses}
                defaultCourse={defaultCourse}
                whatsappUrl={settings.whatsappUrl}
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
