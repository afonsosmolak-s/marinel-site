import { formatDate } from "@/lib/utils";
import type { CakeOrderFormValues } from "@/lib/validations/cake-order";

const DIVIDER = "────────────────────";

export function buildCakeOrderWhatsAppMessage(
  values: CakeOrderFormValues,
): string {
  return [
    "*Nueva solicitud de presupuesto*",
    "",
    "*Cliente*",
    values.fullName,
    "",
    "*Ocasion*",
    values.occasion,
    "",
    "*Estilo*",
    values.style,
    "",
    "*Tamano*",
    `${values.size} (${values.sizeDimensions})`,
    "",
    "*Bizcocho*",
    values.flavour,
    "",
    "*Relleno*",
    values.filling,
    "",
    "*Fecha del evento*",
    formatDate(values.desiredDate),
    "",
    "*Idea para la tarta*",
    values.description,
    "",
    DIVIDER,
    "",
    "*Datos de contacto*",
    "",
    "Telefono: " + values.phone,
    "Email: " + values.email,
    "",
    DIVIDER,
    "",
    "Gracias por confiar en Marinel Pasteleria.",
    "Responderemos lo antes posible con un presupuesto totalmente personalizado.",
  ].join("\n");
}

export function buildCakeOrderWhatsAppUrl(
  whatsappUrl: string,
  values: CakeOrderFormValues,
): string {
  const message = buildCakeOrderWhatsAppMessage(values);
  const separator = whatsappUrl.includes("?") ? "&" : "?";
  return `${whatsappUrl}${separator}text=${encodeURIComponent(message)}`;
}

// Abre un chat directo con el teléfono del cliente (no con el número de
// Marinel) — usado desde el panel para contactar cada solicitud.
export function buildWhatsAppChatUrl(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

// Mensaje del formulario de cursos — tono cercano, la alumna se presenta.
export function buildLeadWhatsAppMessage(values: {
  fullName: string;
  courseInterest: string;
  experienceLevel: string;
  goal?: string | null;
}): string {
  const firstName = values.fullName.trim().split(" ")[0];
  const lines = [
    `¡Hola Marinel! 👋 Soy ${firstName}.`,
    "",
    `Acabo de enviar mi solicitud desde la web — me interesa *${values.courseInterest}* 🎂`,
    "",
    `Mi nivel: ${values.experienceLevel}`,
  ];
  if (values.goal && values.goal.trim() !== "") {
    lines.push(`Mi objetivo: ${values.goal}`);
  }
  lines.push(
    "",
    "¿Me cuentas los próximos pasos para reservar mi plaza? ✨",
  );
  return lines.join("\n");
}

export function buildLeadWhatsAppUrl(
  whatsappUrl: string,
  values: {
    fullName: string;
    courseInterest: string;
    experienceLevel: string;
    goal?: string | null;
  },
): string {
  const message = buildLeadWhatsAppMessage(values);
  const separator = whatsappUrl.includes("?") ? "&" : "?";
  return `${whatsappUrl}${separator}text=${encodeURIComponent(message)}`;
}
