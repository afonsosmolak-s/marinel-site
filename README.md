# Marinel Pastelería

Landing page premium + panel administrativo, desarrollado por **Smolak & Co.**

Documentación del proyecto:

- [PROJECT_BRIEF.md](./PROJECT_BRIEF.md) — objetivo, estructura del sitio, modelo de datos.
- [CLIENT_CONTEXT.md](./CLIENT_CONTEXT.md) — racional de negocio.
- [ARCHITECTURE.md](./ARCHITECTURE.md) — decisiones técnicas y plan de migración a Supabase.
- [PROJECT_STATUS.md](./PROJECT_STATUS.md) — estado actual.
- [TODO.md](./TODO.md) — pendientes.

## Requisitos

- Node.js 20.9+ (recomendado: la misma versión LTS que usa Next.js 16).

## Empezar

```bash
npm install
cp .env.example .env.local   # y completar ADMIN_PASSWORD / ADMIN_SESSION_SECRET
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para el sitio público y [http://localhost:3000/admin/login](http://localhost:3000/admin/login) para el panel (contraseña en `.env.local`).

## Scripts

```bash
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run start    # servir el build de producción
npm run lint     # ESLint
```

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn (`base-nova`, Base UI) · React Hook Form + Zod · Framer Motion · Sonner.

Ver [ARCHITECTURE.md](./ARCHITECTURE.md) para el detalle completo, incluyendo por qué el backend actual es un almacén local (`content/*.json`) en lugar de Supabase, y el plan exacto para migrar cuando el proyecto vaya a producción.

## Estructura de carpetas

```
src/app/(site)/page.tsx        Landing pública (una sola página)
src/app/admin/                 Panel administrativo (login + dashboard protegido)
src/app/admin/actions/         Server actions (CRUD por entidad + auth + upload)
src/components/sections/       Secciones de la landing (Hero, Cursos, Contacto, ...)
src/components/admin/          Componentes del panel (tablas, formularios, sidebar)
src/components/ui/             Primitivos shadcn (Button, Input, Dialog, ...)
src/services/                  Capa de acceso a datos (una función por operación)
src/lib/validations/           Schemas Zod compartidos entre formularios y server actions
content/                       Almacén de datos local (JSON), fase pre-Supabase
supabase/migrations/           Esquema SQL listo para aplicar en el go-live
```
