import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Container } from "@/components/layout/container";
import type { SiteSettings } from "@/types/content";

// Prefijadas con "/" para que funcionen también desde otras páginas (p. ej.
// /galeria), donde un "#ancla" suelto no tendría destino y no haría nada.
const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/#sobre", label: "Sobre Marinel" },
  { href: "/#galeria", label: "Galería" },
  { href: "/#tartas", label: "Tartas a Medida" },
  { href: "/#cursos", label: "Cursos" },
  { href: "/#opiniones", label: "Opiniones" },
  { href: "/#contacto", label: "Contacto" },
];

// Iconos de marca minimalistas — lucide-react ya no incluye logotipos.
function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.5 3c.4 2.1 1.9 3.7 4 4v3a7 7 0 0 1-4-1.3v6.4a5.9 5.9 0 1 1-5.9-5.9c.2 0 .4 0 .6.03v3.06a2.9 2.9 0 1 0 2.3 2.84V3h3z" />
    </svg>
  );
}

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

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="border-t border-border bg-footer-bg">
      <Container className="flex flex-col gap-12 py-16 md:flex-row md:items-start md:justify-between md:py-20">
        <div className="max-w-xs">
          <Link href="/" className="flex flex-col items-center gap-1.5 w-fit">
            <Image
              src="/logo.png"
              alt="Marinel Pastelería"
              width={48}
              height={48}
              className="size-12 rounded-full object-cover"
            />
            <span className="font-heading text-xl font-medium text-foreground italic leading-none">
              Tartas Marinel
            </span>
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Cursos, masterclasses y clases privadas de pastelería, enseñadas
            con técnica y cariño.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-pink hover:text-pink-ink"
            >
              <InstagramIcon className="size-4" />
            </a>
            <a
              href={settings.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-pink hover:text-pink-ink"
            >
              <TikTokIcon className="size-4" />
            </a>
            <a
              href={settings.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-pink hover:text-pink-ink"
            >
              <MessageCircle className="size-4" strokeWidth={1.5} />
            </a>
          </div>
        </div>

        <nav className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
          {NAV_LINKS.map((link) => (
            // <a> nativo a propósito: next/link no baja el scroll a un
            // #ancla cuando el pathname no cambia (probado en preview).
            <a
              key={link.href}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="text-sm text-muted-foreground">
          <p>{settings.email}</p>
          <p className="mt-1">{settings.phone}</p>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Marinel Pastelería</p>
          <p>
            Hecho por{" "}
            <span className="font-medium text-foreground">Smolak & Co.</span>
          </p>
        </Container>
      </div>
    </footer>
  );
}
