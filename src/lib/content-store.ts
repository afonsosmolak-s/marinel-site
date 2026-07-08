import { readFile, writeFile } from "fs/promises";
import path from "path";

// Almacén local en content/*.json — mismo shape que las tablas Postgres que
// se crearán en supabase/migrations/0001_init.sql. Ver ARCHITECTURE.md para
// el plan de migración: solo se reemplaza esta capa, nunca los componentes.
const CONTENT_DIR = path.join(process.cwd(), "content");

export async function readCollection<T>(file: string): Promise<T[]> {
  const raw = await readFile(path.join(CONTENT_DIR, file), "utf-8");
  return JSON.parse(raw) as T[];
}

export async function writeCollection<T>(
  file: string,
  data: T[],
): Promise<void> {
  await writeFile(
    path.join(CONTENT_DIR, file),
    JSON.stringify(data, null, 2) + "\n",
    "utf-8",
  );
}

export async function readSingleton<T>(file: string): Promise<T> {
  const raw = await readFile(path.join(CONTENT_DIR, file), "utf-8");
  return JSON.parse(raw) as T;
}

export async function writeSingleton<T>(file: string, data: T): Promise<void> {
  await writeFile(
    path.join(CONTENT_DIR, file),
    JSON.stringify(data, null, 2) + "\n",
    "utf-8",
  );
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

const DIACRITIC_MARKS = /[̀-ͯ]/g;

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(DIACRITIC_MARKS, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
