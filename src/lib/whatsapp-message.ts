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
