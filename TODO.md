# TODO.md — Marinel Pastelería

## Pendiente inmediato

- [ ] Confirmar el email de contacto real (`hola@marinelpasteleria.com` es un placeholder plausible, no confirmado).
- [ ] Asignar categorías (Bodas/Cumpleaños/Infantiles/Personalizados/Eventos/Otros) a las imágenes de galería ya cargadas — hoy no tienen categoría asignada, así que solo aparecen bajo "Todos" en el filtro de `/galeria`.
- [ ] Revisar que los 4-10 cursos/masterclasses/testimonios publicados actualmente en `content/*.json` sean todos contenido real y definitivo (el proyecto pasó por varias rondas de carga de contenido por la clienta — confirmar que no queda nada de ejemplo mezclado).

## Antes de producción

- [ ] Cambiar `ADMIN_PASSWORD` en `.env.local` a una contraseña real, y compartirla con la clienta por un canal seguro (no por email plano).
- [ ] Decidir si se crea el proyecto Supabase ahora o se mantiene el almacén local hasta el lanzamiento — ver [ARCHITECTURE.md](./ARCHITECTURE.md) § 6 para el plan de migración completo.
- [ ] Si se migra a Supabase: provisionar el usuario admin (Marinel) manualmente, aplicar `supabase/migrations/0001_init.sql`, migrar `services/*.ts` y `lib/auth.ts` según el plan documentado.
- [ ] Registrar el dominio definitivo y actualizar `NEXT_PUBLIC_SITE_URL` (hoy apunta a un placeholder en `.env.local`/`.env.example`).
- [ ] Decidir despliegue (Vercel recomendado, consistente con el stack de Smolak Studio) y conectar dominio.
- [ ] Corregir el documento comercial de Marinel en `1. Orders And Contracts/` — ver la nota en [CLIENT_CONTEXT.md](./CLIENT_CONTEXT.md) (contiene datos de otro cliente).

## Mejoras futuras (no bloqueantes, no implementar sin pedirlo la clienta)

- Dark mode en el panel administrativo (recomendado por el framework `smolak-admin-dashboard`, deliberadamente pospuesto por alcance — ver ARCHITECTURE.md § 7).
- Páginas de detalle por curso (`/cursos/[slug]`) si el negocio crece y se necesita SEO por curso individual.
- Exportación CSV de leads desde `/admin/formularios` si el volumen de solicitudes lo justifica.
- Mapa interactivo con marcador propio (Google Maps JavaScript API) si el embed de solo lectura actual se queda corto.
