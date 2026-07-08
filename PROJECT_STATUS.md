# PROJECT_STATUS.md — Marinel Pastelería

_Última actualización: 2026-07-08._

## Estado general

**Fase actual: en uso activo por la clienta/estudio — Marinel ya está cargando contenido real (cursos, masterclass, galería, testimonios, fotos de Hero/Sobre Marinel) directamente desde el panel.**

El sitio público y el panel administrativo están completos y funcionales de extremo a extremo contra el almacén local (`content/*.json`). Falta: revisión final de copy y la migración a Supabase (ver [ARCHITECTURE.md](./ARCHITECTURE.md) § 6) antes del lanzamiento definitivo.

## Completado

**Fase 1 — sitio y panel base:**
- [x] Next.js 16 + Tailwind v4 + shadcn (`base-nova`) scaffolding, alineado con la convención de Morales Móveis.
- [x] Sistema de diseño (tokens de color, tipografía Playfair Display + Inter, radios, sombras, motion) implementado en `globals.css` y componentes reutilizables.
- [x] Landing pública de una sola página, formulario de contacto validado con Zod y probado de extremo a extremo.
- [x] Panel administrativo: login/logout, protección de rutas server-side, dashboard con KPIs reales, CRUD completo de Cursos/Masterclass/Testimonios, Formularios (leads), Configuración por pestañas.
- [x] Esquema SQL completo para Supabase (`supabase/migrations/0001_init.sql`), listo para aplicar en el go-live.

**Fase 2 — imágenes editables, galería premium v1, sección de marca:**
- [x] Sección de Instagram eliminada; sustituida por una sección animada de marca (`BrandValues`) con frases en ciclo e iconos flotando.
- [x] Categorías de galería (Bodas, Cumpleaños, Infantiles, Personalizados, Eventos, Otros) + reordenamiento por drag-and-drop en el panel (`@dnd-kit`).
- [x] Editor de encuadre de imagen (punto focal + zoom, estilo Shopify) aplicado a **toda** imagen del sitio — cursos, masterclass, testimonios, galería, Hero y Sobre Marinel. Ningún administrador necesita recortar fotos antes de subirlas.
- [x] Hero y Sobre Marinel con imagen editable desde Configuración → Imágenes.
- [x] Sección de Ubicación rediseñada: mapa más pequeño, embed real de Google Maps, enlace "Cómo llegar".
- [x] Dirección real cargada: Calle José Díez Mora, 65, 03205 Elche, Alicante, España.

**Fase 3 — galería en página dedicada, visor tipo Apple Photos, ajustes finales de composición:**
- [x] Preview de Galería en la home reducido a 4 fotos curadas (antes 8-10), con hover sutil y sin masonry — genera curiosidad en vez de mostrarlo todo.
- [x] Nueva página dedicada `/galeria`: portfolio editorial a pantalla completa, grid responsive de tarjetas portrait, filtro por categoría, acepta `?foto=<id>` para deep-link.
- [x] Visor de imagen rediseñado: overlay centrado (nunca a pantalla completa), imagen contenida con márgenes generosos — estilo "Apple Photos", no lightbox tradicional.
- [x] `BrandValues` movida al final del recorrido (Ubicación → BrandValues → Footer), ciclo de frases acelerado a 2s cada una, sección compactada ~50% en altura.
- [x] Sección de Ubicación: tipografía del texto ampliada (~40-50%) para rebalancear la composición frente al mapa más pequeño.
- [x] **Bug real encontrado y corregido**: `AnimatePresence` envolviendo un componente que usa `createPortal` nunca disparaba `onExitComplete` — el visor de imagen se quedaba montado para siempre tras "cerrar". Documentado en ARCHITECTURE.md § 2bis para que no se repita.
- [x] `npm run build` y `npm run lint` limpios (0 errores) en las tres fases.
- [x] Verificación funcional en vivo de las tres fases: login, protección de rutas, CRUD con persistencia confirmada en disco, visor de imagen (apertura, navegación por teclado, ESC, cierre por botón — los tres caminos confirmados tras la corrección del bug), orden de secciones confirmado en el DOM, embed de mapa real confirmado.

## Pendiente antes de producción

Ver [TODO.md](./TODO.md) para la lista accionable completa.

## Notas para quien continúe este proyecto

- **Marinel/el estudio ya están usando el panel en producción local activamente** — prácticamente todo el contenido semilla (seed) de ejemplo ha sido reemplazado o eliminado por contenido real: cursos, masterclass, testimonios con foto, y fotografías reales en la Galería, Hero y Sobre Marinel. `content/*.json` refleja el estado real del sitio en cada momento — consultarlo antes de asumir que algo sigue siendo placeholder.
- Asignar categorías a las fotos de galería ya cargadas sigue pendiente — ver TODO.md.
- La contraseña de admin de desarrollo está en `.env.local` (no versionado) — **cambiarla antes de compartir el panel de forma más amplia**.
