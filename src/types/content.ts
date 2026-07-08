export type CourseLevel = "Iniciación" | "Intermedio" | "Avanzado";
export type CourseFormat = "Presencial" | "Online";

// Encuadre de una imagen — punto focal (drag) + zoom, aplicado en pantalla
// vía object-position + transform scale. Null = encuadre por defecto (centro).
export interface ImagePosition {
  focalX: number; // 0-100
  focalY: number; // 0-100
  zoom: number; // 1 (sin zoom) - 3
}

export const GALLERY_CATEGORIES = [
  "Bodas",
  "Cumpleaños",
  "Infantiles",
  "Personalizados",
  "Eventos",
  "Otros",
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: CourseLevel;
  format: CourseFormat;
  imageUrl: string | null;
  imagePosition: ImagePosition | null;
  startDate: string | null; // ISO date, null = sin fecha fija
  availablePlaces: number | null;
  duration: string | null; // texto libre — "5 horas", "3 semanas"...
  badge: string | null; // insignia opcional, p. ej. "Nuevo"
  price: string | null; // texto libre — sin pago online, ver CLIENT_CONTEXT.md
  featured: boolean;
  orderIndex: number;
  published: boolean;
}

export interface Masterclass {
  id: string;
  title: string;
  description: string;
  date: string | null; // ISO date, null => "Próximamente"
  location: string | null;
  imageUrl: string | null;
  imagePosition: ImagePosition | null;
  capacity: number | null;
  orderIndex: number;
  published: boolean;
}

export interface GalleryImage {
  id: string;
  imageUrl: string | null;
  imagePosition: ImagePosition | null;
  caption: string | null;
  categories: GalleryCategory[];
  featured: boolean;
  orderIndex: number;
  published: boolean;
}

export interface Testimonial {
  id: string;
  authorName: string;
  authorRole: string | null;
  content: string;
  avatarUrl: string | null;
  imagePosition: ImagePosition | null;
  orderIndex: number;
  published: boolean;
}

export type LeadStatus = "nuevo" | "contactado" | "confirmado" | "descartado";

export interface Lead {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  courseInterest: string;
  experienceLevel: string;
  goal: string | null;
  message: string | null;
  status: LeadStatus;
  createdAt: string;
}

export const ORDER_FLAVOURS = [
  "Chocolate",
  "Vainilla",
  "Limón",
  "Naranja",
  "Red Velvet",
  "Zanahoria",
] as const;
export type OrderFlavour = (typeof ORDER_FLAVOURS)[number];

export const ORDER_FILLINGS = [
  "Ganache de Chocolate",
  "Pistacho",
  "Oreo",
  "Kinder Bueno",
  "Dulce de leche",
  "Nata",
  "Mousse de Mango",
  "Mousse de Maracuyá",
  "Frutos del Bosque",
] as const;
export type OrderFilling = (typeof ORDER_FILLINGS)[number];

// Los tamaños de tarta son gestionables desde el panel (nombre + medidas +
// orden + visibilidad) — nunca hardcodeados. Ver /admin/tamanos.
export interface CakeSize {
  id: string;
  name: string;
  width: number; // cm
  height: number; // cm
  orderIndex: number;
  published: boolean;
}

// Los estilos de tarta también se gestionan desde el panel — /admin/estilos.
export interface CakeStyle {
  id: string;
  name: string;
  orderIndex: number;
  published: boolean;
}

// Las ocasiones también se gestionan desde el panel — /admin/ocasiones.
export interface CakeOccasion {
  id: string;
  name: string;
  orderIndex: number;
  published: boolean;
}

export type CakeOrderStatus = "pendiente" | "contactado" | "completado";

export interface CakeOrder {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  // Nombre de la ocasión elegida (snapshot, igual que style/size) — las
  // ocasiones disponibles se gestionan en /admin/ocasiones.
  occasion: string;
  // Nombre del estilo elegido (snapshot, igual que size) — los estilos
  // disponibles se gestionan en /admin/estilos.
  style: string;
  flavour: OrderFlavour;
  filling: OrderFilling;
  // Nombre y medidas del tamaño elegido, guardados como snapshot en el
  // momento del pedido — si luego se edita/borra el tamaño en el panel, los
  // pedidos ya enviados no cambian.
  size: string;
  sizeDimensions: string;
  desiredDate: string;
  description: string;
  status: CakeOrderStatus;
  createdAt: string;
}

export interface SiteSettings {
  heroEyebrow: string;
  heroTitle: string;
  heroTitleAccent: string;
  heroSubtitle: string;
  heroImageUrl: string | null;
  heroImagePosition: ImagePosition | null;
  aboutTitle: string;
  aboutTitleAccent: string;
  aboutBody: string[];
  aboutImageUrl: string | null;
  aboutImagePosition: ImagePosition | null;
  instagramUrl: string;
  tiktokUrl: string;
  whatsappUrl: string;
  whatsappNumber: string;
  communityUrl: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  mapEmbedUrl: string;
  seoTitle: string;
  seoDescription: string;
}
