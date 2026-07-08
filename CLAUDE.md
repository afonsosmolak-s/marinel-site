@AGENTS.md

# Marinel Pastelería

Antes de trabajar en este proyecto, leer:

- [PROJECT_BRIEF.md](./PROJECT_BRIEF.md) — objetivo, estructura del sitio, modelo de datos.
- [CLIENT_CONTEXT.md](./CLIENT_CONTEXT.md) — por qué el sitio vende cursos y no tartas, por qué no hay pago online.
- [ARCHITECTURE.md](./ARCHITECTURE.md) — stack, design system, y el plan exacto de migración a Supabase (el backend actual es local, `content/*.json`, deliberadamente).
- [PROJECT_STATUS.md](./PROJECT_STATUS.md) y [TODO.md](./TODO.md) — qué está hecho y qué falta.

Nota de compatibilidad importante: este proyecto usa **Base UI** (`@base-ui/react`), no Radix — los componentes usan la prop `render` para polimorfismo, no `asChild`. Ver ARCHITECTURE.md § 4 para un bug real ya documentado sobre esto (`nativeButton={false}` al usar `Button` como enlace — usar `src/components/ui/link-button.tsx` en vez de reimplementar el patrón).
