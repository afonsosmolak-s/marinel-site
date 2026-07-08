# CLIENT_CONTEXT.md — Marinel Pastelería

> Racional de negocio detrás de las decisiones de producto. Léase junto a [PROJECT_BRIEF.md](./PROJECT_BRIEF.md).

## Quién es la clienta

Marinel es chef pastelera en España. Su negocio tiene dos caras:

1. **Tartas personalizadas** — encargos para momentos especiales (bodas, cumpleaños). Hoy es la cara más visible en Instagram.
2. **Formación** — cursos presenciales, masterclasses de cupo reducido y clases privadas. **Esta es la prioridad de negocio del sitio.**

Hoy su canal principal es Instagram (`@tartasmarinel`, también TikTok `@chefpasteleramarinel`). El sitio existe para dejar de depender únicamente de eso y dar autoridad/estructura a la venta de formación.

## Por qué cursos y no tartas

Las tartas personalizadas son un negocio de capacidad limitada (una chef, encargos artesanales) — no escala. Los cursos y masterclasses sí escalan (un mismo curso, múltiples alumnas) y construyen una marca personal de "chef que enseña", con mayor valor de por vida por cliente. El brief del proyecto es explícito en este punto: las tartas se muestran **solo para reforzar confianza y mostrar oficio**, nunca como objetivo de conversión del sitio.

## El flujo de curso (por qué no hay pago online)

```
Visitante elige un curso
        ↓
Completa el formulario (nombre, contacto, curso, nivel, objetivo)
        ↓
Marinel recibe la solicitud en el panel (/admin/formularios)
        ↓
Evalúa el nivel/objetivo de la alumna
        ↓
Contacta personalmente (WhatsApp o email)
        ↓
Explica el método de pago (Bizum, transferencia)
        ↓
Plaza confirmada
```

Esto es deliberado, no una limitación técnica: Marinel quiere hablar personalmente con cada alumna antes de confirmar, tanto para cualificar el nivel como para vender la experiencia. Cualquier propuesta futura de checkout online debe confirmarse explícitamente con la clienta antes de implementarse — cambiaría el modelo de negocio, no solo la tecnología.

## Presupuesto y alcance

El proyecto se vendió como parte del tier de **209€** ("Landing Page Premium", ver `4. Templates/Presentación Tartas Marinel.pdf`). Esto no es solo un dato comercial — es una restricción de diseño activa: cada dependencia, abstracción o funcionalidad añadida en este proyecto debe justificarse contra ese nivel de inversión. Ver las "Scope decisions" registradas en el historial de planificación de la sesión que originó este proyecto — la razón de fondo siempre es "mantenerlo lean".

## Fotografía

La clienta aún no ha enviado fotografía final (`3. Logos/` está vacía a fecha de este documento). Todo el sitio se construyó con el sistema `MediaPlaceholder` para que las fotos puedan incorporarse después sin rediseñar nada — ver ARCHITECTURE.md.

## Referencias

- Brief detallado original (estructura de secciones, paleta, panel admin): capturado en la conversación de planificación del proyecto.
- Propuesta comercial aprobada: `4. Templates/Presentación Tartas Marinel.pdf` — confirma orden de secciones, módulos del panel, precio (209€) y ausencia de pago online.
- Contactos oficiales: Instagram `instagram.com/tartasmarinel`, TikTok `tiktok.com/@chefpasteleramarinel`, WhatsApp `+34 644 04 32 94`, comunidad de WhatsApp para masterclasses.

## Nota administrativa (no accionar sin pedirlo la clienta/Afonso)

El archivo `1. Orders And Contracts/Smolak — Documento Comercial (Proposta + Fatura + Contrato).xlsx` contenía, a la fecha de este documento, datos de otro cliente (Vandinho / V9 Soccer Team) — parece haberse duplicado desde `SM005_V9 Soccer` y no haberse actualizado para Marinel. No se tocó como parte de este proyecto; queda registrado aquí para que se corrija antes de enviarse.
