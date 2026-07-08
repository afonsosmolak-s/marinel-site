# PROJECT_BRIEF.md — Marinel Pastelería

> Documento maestro de planificación. Consolida objetivo, arquitectura, stack y alcance. Toda decisión de desarrollo debe poder rastrearse a este documento. Ver también [CLIENT_CONTEXT.md](./CLIENT_CONTEXT.md) para el racional de negocio y [ARCHITECTURE.md](./ARCHITECTURE.md) para las decisiones técnicas y el plan de migración a Supabase.

---

## 1. Resumen ejecutivo

Landing page premium de una sola página para **Marinel Pastelería**, chef pastelera en España, más un panel de administración. El objetivo del sitio **no es vender tartas** — es vender **cursos, masterclasses y clases privadas**. Las tartas personalizadas se muestran solo como contenido de confianza/autoridad. No hay pago online: el sitio es un embudo de captación de leads que termina en una conversación personal por WhatsApp, donde Marinel acuerda el pago (Bizum o transferencia).

## 2. Objetivos

**Objetivo principal:** convertir visitantes (mayormente desde Instagram) en solicitudes de información sobre cursos, cualificadas por nivel y objetivo.

**Objetivos secundarios:**
- Dar autoridad y presencia profesional a la marca personal de Marinel más allá de Instagram.
- Centralizar la información de cursos y masterclasses (hoy dispersa en stories/publicaciones).
- Dar a Marinel autonomía total para gestionar cursos, masterclasses, galería, testimonios y textos sin depender de un desarrollador.

**Acción principal esperada del visitante:** enviar el formulario de contacto con el curso de interés.

## 3. No-objetivos (explícitos)

- No hay checkout ni pago online (ver [CLIENT_CONTEXT.md](./CLIENT_CONTEXT.md) § flujo de curso).
- No hay páginas de detalle por curso — es una landing de una sola página con secciones ancla (ver decisión en el plan de arquitectura, sección 5).
- No hay sección de Instagram ni integración con su API — eliminada a pedido de la clienta; la Galería premium (con lightbox) cumple ese rol de mostrar el trabajo, y una sección animada de marca (`BrandValues`) cierra el recorrido antes del Contacto.
- No hay Supabase todavía — el backend de esta fase es un almacén local en `content/*.json` (ver [ARCHITECTURE.md](./ARCHITECTURE.md)).

---

## 4. Estructura del sitio

```
/                        Landing de una sola página (secciones ancla)
  #top                   Hero
  #sobre                 Sobre Marinel
  #galeria                Galería (preview de 4 fotos → enlaza a /galeria)
  #cursos                Cursos
  #masterclass            Masterclass
  #opiniones              Testimonios
  #contacto               Formulario de contacto
  #ubicacion               Ubicación
  (sin ancla)              Sección de marca animada (BrandValues) — última, antes del footer

/galeria                 Galería completa (portfolio editorial + visor de imagen)

/admin/login                        Login del panel
/admin                              Redirige a /admin/dashboard o /admin/login
/admin/dashboard                    Panel — KPIs, últimas solicitudes, accesos rápidos
/admin/cursos [+/nuevo] [+/[id]]     Gestión de cursos
/admin/masterclass [+/nuevo] [+/[id]] Gestión de masterclasses
/admin/galeria                       Gestión de la galería (modal, sin páginas separadas)
/admin/testimonios [+/nuevo] [+/[id]] Gestión de testimonios
/admin/formularios                   Solicitudes recibidas (leads)
/admin/configuracion                 Textos, contacto/redes y SEO (por pestañas)
```

### Por qué esta estructura

- **Una sola página** porque el producto vendido a la clienta es explícitamente una "Landing Page Premium" (ver la propuesta comercial en `4. Templates/Presentación Tartas Marinel.pdf`), y porque el recorrido del cliente aprobado es lineal: descubre → se enamora de las creaciones → conoce la historia → descubre los cursos → reserva → contacta por WhatsApp.
- **Cursos y Masterclass sin página de detalle propia**: el CTA de cada tarjeta ancla directamente al formulario de contacto con el curso pre-seleccionado (`/?curso=<nombre>#contacto`), manteniendo el embudo a un único punto de conversión.
- **Galería sin páginas `/nuevo` y `/[id]`**: la entidad solo tiene imagen + descripción + orden, así que un modal en la misma página de listado es más eficiente que el patrón completo de tres pantallas.

## 5. Modelo de datos

Ver [`src/types/content.ts`](./src/types/content.ts) para los tipos completos y [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql) para el esquema equivalente en Postgres (mismo shape, ver ARCHITECTURE.md).

Entidades: `courses`, `masterclasses`, `gallery_images`, `testimonials`, `leads`, `site_settings` (singleton).

## 6. Panel administrativo

Sigue el framework `smolak-admin-dashboard`: sidebar agrupada (Panel / Contenido: Cursos, Masterclass, Galería, Testimonios / Negocio: Formularios, Configuración), mismo esqueleto de CRUD en cada entidad (listado con búsqueda + toggle de publicación inline → crear/editar con formulario compartido → eliminar con modal de confirmación nombrando el elemento), estados vacíos como pantallas de primera clase, toasts de confirmación.

## 7. Stack

Next.js 16 (App Router, Turbopack) · React 19.2 · TypeScript · Tailwind CSS v4 (tokens CSS, sin `tailwind.config.ts`) · shadcn (`base-nova`, Base UI) · React Hook Form + Zod · Framer Motion · Sonner. Ver [ARCHITECTURE.md](./ARCHITECTURE.md) para el detalle completo y el racional de cada elección.

## 8. Paleta y tipografía (resumen — ver ARCHITECTURE.md § Design System para el detalle)

Blanco dominante, rosa pastel (`#F8B7C5`) reservado para highlights (nunca relleno grande), marrón cálido (`#8B6B5C`) para detalles finos. Playfair Display (títulos, con palabras en cursiva como acento) + Inter (texto).

## 9. Fuera de alcance hoy, preparado para el futuro

- Migración a Supabase (Auth + Postgres + Storage) — esquema y RLS ya escritos, solo falta crear el proyecto y aplicar la migración.
- Fotografía real — cada slot de imagen usa `MediaPlaceholder`, que acepta `src` opcional; se reemplaza sin tocar el layout.
- Dark mode — deliberadamente no implementado esta fase (ver ARCHITECTURE.md, decisión de alcance).
