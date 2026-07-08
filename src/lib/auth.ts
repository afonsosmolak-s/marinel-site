import { createHmac, timingSafeEqual } from "crypto";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";

// Puerta de acceso local por contraseña única — sustituida por Supabase Auth
// en el go-live (ver ARCHITECTURE.md). La sesión es una cookie firmada con
// HMAC para que no pueda falsificarse trivialmente, aunque no hay usuarios
// múltiples ni roles en esta fase.
const COOKIE_NAME = "marinel_admin_session";
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ?? "dev-only-insecure-secret-change-me";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function sign(value: string): string {
  return createHmac("sha256", SESSION_SECRET).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

export function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected || !password) return false;
  return safeEqual(password, expected);
}

const ENV_LOCAL_PATH = path.join(process.cwd(), ".env.local");

// Actualiza la contraseña en caliente (proceso actual) y la persiste en
// .env.local para que sobreviva a un reinicio del servidor. .env.local está
// en .gitignore, así que la contraseña nunca llega al repositorio.
export async function updateAdminPassword(newPassword: string): Promise<void> {
  process.env.ADMIN_PASSWORD = newPassword;

  let contents = "";
  try {
    contents = await readFile(ENV_LOCAL_PATH, "utf-8");
  } catch {
    contents = "";
  }

  const line = `ADMIN_PASSWORD=${newPassword}`;
  if (/^ADMIN_PASSWORD=.*$/m.test(contents)) {
    contents = contents.replace(/^ADMIN_PASSWORD=.*$/m, line);
  } else if (contents.length > 0) {
    contents = `${contents.replace(/\n*$/, "\n")}${line}\n`;
  } else {
    contents = `${line}\n`;
  }

  await writeFile(ENV_LOCAL_PATH, contents, "utf-8");
}

export async function createSession(): Promise<void> {
  const issuedAt = Date.now().toString();
  const signature = sign(issuedAt);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, `${issuedAt}.${signature}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return false;
  const [issuedAt, signature] = raw.split(".");
  if (!issuedAt || !signature) return false;
  return safeEqual(signature, sign(issuedAt));
}
