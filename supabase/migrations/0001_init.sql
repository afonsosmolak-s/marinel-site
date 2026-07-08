-- Marinel Pastelería — esquema inicial.
-- Mirrors the shape of content/*.json exactly (see src/types/content.ts and
-- ARCHITECTURE.md). Applied at go-live; not run against a live project yet.

create extension if not exists "pgcrypto";

-- Encuadre de imagen (punto focal + zoom) — mismo shape que ImagePosition en
-- src/types/content.ts, guardado como jsonb: {"focalX":50,"focalY":50,"zoom":1}
create table courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  level text not null check (level in ('Iniciación', 'Intermedio', 'Avanzado')),
  format text not null check (format in ('Presencial', 'Online')),
  image_url text,
  image_position jsonb,
  order_index integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table masterclasses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  date timestamptz,
  location text,
  image_url text,
  image_position jsonb,
  capacity integer,
  order_index integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text,
  image_position jsonb,
  caption text,
  categories text[] not null default '{}',
  order_index integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_role text,
  content text not null,
  avatar_url text,
  image_position jsonb,
  order_index integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text not null,
  city text not null,
  course_interest text not null,
  experience_level text not null,
  goal text,
  message text,
  status text not null default 'nuevo'
    check (status in ('nuevo', 'contactado', 'confirmado', 'descartado')),
  created_at timestamptz not null default now()
);

-- Singleton: una única fila con id fijo.
create table site_settings (
  id integer primary key default 1 check (id = 1),
  hero_eyebrow text not null default '',
  hero_title text not null default '',
  hero_title_accent text not null default '',
  hero_subtitle text not null default '',
  hero_image_url text,
  hero_image_position jsonb,
  about_title text not null default '',
  about_title_accent text not null default '',
  about_body jsonb not null default '[]',
  about_image_url text,
  about_image_position jsonb,
  instagram_url text not null default '',
  tiktok_url text not null default '',
  whatsapp_url text not null default '',
  whatsapp_number text not null default '',
  community_url text not null default '',
  phone text not null default '',
  email text not null default '',
  city text not null default '',
  address text not null default '',
  map_embed_url text not null default '',
  seo_title text not null default '',
  seo_description text not null default '',
  updated_at timestamptz not null default now()
);

insert into site_settings (id) values (1);

-- RLS: contenido publicado es de lectura pública; escritura solo para
-- usuarios autenticados (panel admin). Leads: inserción pública (formulario
-- del sitio), lectura solo autenticada.
alter table courses enable row level security;
alter table masterclasses enable row level security;
alter table gallery_images enable row level security;
alter table testimonials enable row level security;
alter table leads enable row level security;
alter table site_settings enable row level security;

create policy "public read published courses" on courses
  for select using (published = true);
create policy "authenticated full access courses" on courses
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "public read published masterclasses" on masterclasses
  for select using (published = true);
create policy "authenticated full access masterclasses" on masterclasses
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "public read published gallery" on gallery_images
  for select using (published = true);
create policy "authenticated full access gallery" on gallery_images
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "public read published testimonials" on testimonials
  for select using (published = true);
create policy "authenticated full access testimonials" on testimonials
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "public insert leads" on leads
  for insert with check (true);
create policy "authenticated read leads" on leads
  for select using (auth.role() = 'authenticated');
create policy "authenticated update leads" on leads
  for update using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
create policy "authenticated delete leads" on leads
  for delete using (auth.role() = 'authenticated');

create policy "public read site settings" on site_settings
  for select using (true);
create policy "authenticated update site settings" on site_settings
  for update using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
