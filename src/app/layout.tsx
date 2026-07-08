import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/services/settings";
import { SITE_URL } from "@/lib/site";
import { Toaster } from "@/components/ui/sonner";
import { Preloader } from "@/components/layout/preloader";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const DEFAULT_TITLE = "Marinel Pastelería | Cursos y Masterclasses de Repostería";
const DEFAULT_DESCRIPTION =
  "Aprende pastelería profesional con Marinel: cursos, masterclasses y clases privadas de tartas de diseño, chantilly y decoración.";

// Metadata generada desde site_settings (editable desde el panel), nunca
// hardcodeada — ver ARCHITECTURE.md.
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings.seoTitle || DEFAULT_TITLE;
  const description = settings.seoDescription || DEFAULT_DESCRIPTION;

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s | Marinel Pastelería` },
    description,
    openGraph: {
      title,
      description,
      siteName: "Marinel Pastelería",
      type: "website",
      locale: "es_ES",
      url: SITE_URL,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Preloader />
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
