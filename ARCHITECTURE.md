# ARCHITECTURE.md — Marinel Pastelería

> Registro de decisiones técnicas (ADR-style) y plan de migración a Supabase. Ver [PROJECT_BRIEF.md](./PROJECT_BRIEF.md) para el alcance de producto.

---

## 1. Stack y por qué

Mirror deliberado de `SM006_Morales Móveis` (proyecto hermano de Smolak Studio), para que cualquier desarrollador del estudio reconozca las convenciones al instante:

- **Next.js 16 (App Router, Turbopack por defecto)**, React 19.2, TypeScript.
- **Tailwind CSS v4** — tokens definidos como custom properties CSS en `src/app/globals.css` vía `@theme inline`, **sin** `tailwind.config.ts` (convención v4).
- **shadcn (`base-nova` style) sobre Base UI** (`@base-ui/react`), no Radix. Diferencia clave frente a Radix: los componentes usan la prop `render` (elemento o función) para polimorfismo, no `asChild`. Ver § 4 para el detalle — es la causa de un bug real que se dio durante el desarrollo.
- **React Hook Form + Zod + `@hookform/resolvers`** — mismo schema de validación en cliente y en las server actions.
- **Framer Motion** (no GSAP, a diferencia de Morales) — el brief pide restraint ("sofisticado", nunca "espectacular"); `whileInView` cubre todo lo necesario sin añadir una segunda librería de animación.
- **Sonner** para toasts.
- **@dnd-kit** (`core` + `sortable` + `utilities`) — reordenar la Galería por drag-and-drop en el panel.
- **No instalado esta fase**: `@supabase/ssr`, `@supabase/supabase-js`, `next-themes` (dark mode no implementado). Ver § 3 y § 6.

## 2. Design system

Paleta de marca definida en `globals.css` (tokens `--warm`, `--pink-tint`, `--pink`, `--pink-ink`, `--brown`, sobre la base neutra de shadcn):

| Token | Valor | Uso |
|---|---|---|
| `--background` | `#ffffff` | dominante |
| `--warm` | `#faf9f7` | fondos de sección alternos |
| `--pink-tint` | `#fdecef` | fondos de badges/highlights |
| `--pink` | `#f8b7c5` | acentos, bordes activos |
| `--pink-ink` | `#b5677b` | texto/enlaces sobre rosa (derivado para contraste AA) |
| `--brown` | `#8b6b5c` | detalles finos, acentos en cursiva |

**Regla de oro (del brief del cliente): el rosa nunca es un relleno grande de superficie** — solo aparece en badges, palabras en cursiva de énfasis, bordes de hover y focos. Los CTAs primarios usan `--foreground` (tinta oscura) como relleno, con el rosa como acento de hover/glow.

Radio base `--radius: 0.75rem` (más redondeado que Morales, deliberado — ver la propuesta comercial aprobada, que usa esquinas muy suaves ~20-24px en las tarjetas). Tipografía: Playfair Display (`--font-heading`, con cursiva) + Inter (`--font-sans`).

Componente central del sistema de placeholders: [`src/components/media-placeholder.tsx`](./src/components/media-placeholder.tsx) — acepta `src` opcional; sin foto real muestra una caja con tono degradado + ícono, sin cambiar el layout cuando la foto llega.

### Encuadre de imagen (punto focal + zoom)

Toda imagen del sitio (`Course.imageUrl`, `Masterclass.imageUrl`, `GalleryImage.imageUrl`, `Testimonial.avatarUrl`, `SiteSettings.heroImageUrl`, `SiteSettings.aboutImageUrl`) va acompañada de un campo `imagePosition: ImagePosition | null` (`{ focalX, focalY, zoom }`, ver `src/types/content.ts`). Nunca hay que recortar una foto antes de subirla:

- [`src/components/admin/image-position-editor.tsx`](./src/components/admin/image-position-editor.tsx) — arrastra sobre la vista previa para fijar el punto focal, desliza para el zoom.
- [`src/components/admin/image-field.tsx`](./src/components/admin/image-field.tsx) — combina subida (server action `uploadImage`) + `ImagePositionEditor` en un solo campo; es **el único componente de imagen que debe usarse en formularios del panel** (cursos, masterclasses, testimonios, galería, Hero/Sobre Marinel en Configuración → Imágenes).
- `MediaPlaceholder` aplica el encuadre en pantalla vía `object-position` + `transform: scale()` cuando recibe la prop `position`.

## 2bis. Galería premium: preview + página dedicada + visor

- [`src/components/sections/gallery.tsx`](./src/components/sections/gallery.tsx) — preview de portada: **solo 4** imágenes publicadas, tarjetas 4:5, mucho espacio en blanco, hover sutil (zoom + sombra, 500ms). Genera curiosidad en vez de mostrarlo todo — es un componente de servidor puro (sin estado), cada tarjeta y el botón "Explorar galería completa" son enlaces `next/link` a `/galeria`.
- [`src/app/(site)/galeria/page.tsx`](./src/app/(site)/galeria/page.tsx) — página dedicada, portfolio editorial: fondo blanco, tipografía grande, grid responsive de tarjetas portrait uniformes. Acepta `?foto=<id>` para abrir el visor directamente en una imagen concreta (así es como enlazan las tarjetas de la portada).
- [`src/components/sections/gallery-full.tsx`](./src/components/sections/gallery-full.tsx) — cliente: grid + chips de filtro por categoría + estado del visor.
- [`src/components/sections/gallery-viewer.tsx`](./src/components/sections/gallery-viewer.tsx) — visor tipo "Apple Photos", **nunca a pantalla completa**: overlay centrado con fondo oscuro difuminado, imagen contenida en una tarjeta `max-w-sm md:max-w-md` con márgenes generosos alrededor, flechas fuera de la imagen. Teclado (flechas/ESC), swipe táctil, contador, cierre por click en el fondo.
  - **Nota importante**: este componente usa `createPortal` (renderiza en `document.body`) y **no debe envolverse en `<AnimatePresence>`** en el padre — se comprobó en desarrollo que la combinación `AnimatePresence` + `createPortal` nunca dispara `onExitComplete`, dejando el overlay montado para siempre aunque el estado que lo controla ya sea `null`. El cierre es instantáneo (solo la entrada tiene fade-in); ver el comentario en el propio archivo.
- Categorías (`GALLERY_CATEGORIES` en `src/types/content.ts`: Bodas, Cumpleaños, Infantiles, Personalizados, Eventos, Otros) — multi-selección por imagen desde el panel, filtro por chips en `/galeria`.
- Orden: `GalleryImage.orderIndex`, reordenable por drag-and-drop en [`src/components/admin/gallery-manager.tsx`](./src/components/admin/gallery-manager.tsx) (`@dnd-kit`) vía la server action `reorderGalleryImagesAction`. El estado local de orden se sincroniza con los props durante el render (no en un `useEffect`, para evitar el warning de la regla `react-hooks/set-state-in-effect`) — ver el patrón en `GalleryManager`.

## 2ter. Sección de marca animada (reemplaza Instagram)

[`src/components/sections/brand-values.tsx`](./src/components/sections/brand-values.tsx) — última sección antes del Footer (después de Ubicación, por pedido explícito de la clienta — cierre emocional del recorrido). Tres frases en ciclo de 2s cada una (`useState` + `setTimeout`, nunca un `setInterval` para poder limpiar correctamente en cada paso), seguidas de 4s solo con los iconos flotando. Sección deliberadamente compacta (`py-14 md:py-20`, no una sección a pantalla completa) para que actúe como transición, no como bloque propio. Respeta `prefers-reduced-motion` (framer-motion `useReducedMotion`). La sección de Instagram se eliminó por decisión explícita de la clienta — la Galería ya cumple ese rol.

## 3. Backend actual: almacén local (no Supabase todavía)

Decisión de alcance (no limitación técnica): en lugar de crear un proyecto Supabase antes de validar el diseño con la clienta, la capa de datos vive en `content/*.json`, con exactamente el mismo shape que tendrán las tablas Postgres.

- [`src/lib/content-store.ts`](./src/lib/content-store.ts) — helpers genéricos de lectura/escritura (`readCollection`, `writeCollection`, `readSingleton`, `writeSingleton`) sobre `content/*.json` vía `fs/promises`.
- [`src/services/*.ts`](./src/services) — una función por entidad (`getCourses`, `createCourse`, `toggleCoursePublished`, etc.), **única implementación**, sin una capa paralela `services/local` vs `services/supabase` que hoy no tendría uso real.
- Las imágenes subidas desde el panel se guardan en `public/uploads/{entidad}/` vía [`src/app/admin/actions/upload.ts`](./src/app/admin/actions/upload.ts) — mismo patrón de "URL relativa hoy, URL absoluta de Storage mañana" que ya usa Morales (`toAbsoluteUrl` en `lib/site.ts`).

**Nada de esto es un rediseño temporal descartable**: las funciones de `services/*.ts` ya tienen exactamente la forma que tendrán cuando hablen con Postgres. Migrar significa reescribir el cuerpo de esas funciones, no las páginas ni los componentes que las consumen.

## 4. Auth actual: contraseña única (no Supabase Auth todavía)

[`src/lib/auth.ts`](./src/lib/auth.ts) — sesión por cookie firmada con HMAC (`crypto.createHmac`), contraseña única comparada con `timingSafeEqual` contra `ADMIN_PASSWORD` (`.env.local`). **No hay usuarios múltiples ni roles** — apropiado para una única administradora (Marinel) en esta fase.

La *pantalla* de login y el layout protegido (`src/app/admin/(dashboard)/layout.tsx`, que hace `redirect` server-side si `!isAuthenticated()`) ya tienen su forma final — solo cambia qué hay detrás de `isAuthenticated()` y `verifyPassword()` al migrar (ver § 6).

### Bug real encontrado y su causa (documentado para el próximo desarrollador)

Base UI's `Button` asume por defecto que se renderiza como `<button>` nativo (`nativeButton: true`). Al usarlo como enlace vía `render={<a .../>}` sin `nativeButton={false}`, Base UI emite un warning en consola y **rompe la semántica de accesibilidad** del elemento. Se centralizó la solución en [`src/components/ui/link-button.tsx`](./src/components/ui/link-button.tsx) (`LinkButton`), que siempre pasa `nativeButton={false}` — úsese ese componente para cualquier CTA que en realidad es un enlace, no un botón nativo.

## 5. Formulario público → lead

[`src/components/forms/lead-form.tsx`](./src/components/forms/lead-form.tsx) (React Hook Form + Zod, `src/lib/validations/lead.ts`) llama a la server action [`src/app/actions/lead.ts`](./src/app/actions/lead.ts), que valida de nuevo en servidor y llama a `services/leads.createLead`. El campo "curso de interés" puede pre-rellenarse vía `?curso=<nombre>#contacto` — las tarjetas de Cursos/Masterclass enlazan así (ver `src/components/sections/courses.tsx` y `masterclasses.tsx`).

## 6. Plan de migración a Supabase (go-live)

Cuando la clienta apruebe el diseño y se decida ir a producción:

1. **Crear el proyecto Supabase** (vía MCP tools de Supabase o el dashboard).
2. **Aplicar la migración** ya escrita: [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql) — crea las 6 tablas (`courses`, `masterclasses`, `gallery_images`, `testimonials`, `leads`, `site_settings`), con RLS ya definido (lectura pública de contenido publicado, escritura solo autenticada, inserción pública de leads).
3. **Instalar** `@supabase/ssr` y `@supabase/supabase-js`; crear `src/lib/supabase/{client,server}.ts` siguiendo exactamente el patrón de Morales Móveis (`createBrowserClient` / `createServerClient` con las env vars `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. **Reescribir `src/services/*.ts`** para usar el cliente Supabase en vez de `content-store.ts` — misma firma de funciones, mismo tipo de retorno (`src/types/content.ts` no cambia).
5. **Migrar `src/app/admin/actions/upload.ts`** para subir a Supabase Storage en vez de `public/uploads/`; actualizar `toAbsoluteUrl`-equivalente si aplica.
6. **Reemplazar `src/lib/auth.ts`** por Supabase Auth: crear el usuario admin (Marinel) manualmente en el dashboard de Supabase, cambiar `isAuthenticated`/`verifyPassword` por la sesión de Supabase. El login (`src/app/admin/login/page.tsx`) y el layout protegido no necesitan cambios de UI, solo de implementación.
7. **Provisionar un lead único de prueba** end-to-end antes de anunciar el sitio a la clienta como definitivo.

Nada de este plan requiere tocar `src/components/sections/*`, `src/components/admin/*` ni ninguna página — el contrato de datos (`src/types/content.ts`) es la frontera estable entre "hoy" y "producción".

## 7. Decisiones de alcance explícitas (por qué NO están hechas)

| Decisión | Razón |
|---|---|
| Sin páginas de detalle por curso | El producto vendido es una landing de una página; cada CTA de curso ancla al formulario con el curso pre-seleccionado. |
| Sin dark mode | No pedido en el brief (sitio blanco dominante por diseño); duplicaría la superficie de revisión visual sin beneficio pedido. |
| Sin TanStack Table | El volumen de datos (decenas de registros, no miles) no justifica una librería de tablas headless; se construyó `AdminTable`, un componente simple con búsqueda client-side. |
| Sin sección de Instagram | Eliminada a pedido explícito de la clienta: la Galería premium ya cumple ese rol y evita la complejidad de una integración en vivo con la API de Instagram (tokens, rate limits) fuera del tier de 209€. Sustituida por la sección animada de marca (`BrandValues`). |
| Auth de contraseña única, no Supabase Auth | No hay proyecto Supabase todavía (ver § 3) — decisión reversible, documentada en § 6. |
| Mapa: `iframe` de Google Maps sin API key | `https://www.google.com/maps?q=<dirección>&output=embed` es de solo lectura y no requiere clave ni facturación — suficiente para mostrar la ubicación real. Si en el futuro se necesita un mapa interactivo con marcadores propios, requeriría Google Maps JavaScript API + clave facturable. |
