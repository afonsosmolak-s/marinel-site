"use server";

import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function uploadImage(
  formData: FormData,
  folder: string,
): Promise<{ url: string } | { error: string }> {
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { error: "Archivo inválido." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "El archivo debe ser una imagen." };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { error: "La imagen no puede superar 5MB." };
  }

  const safeFolder = folder.replace(/[^a-z0-9-]/gi, "");
  const ext = path.extname(file.name).toLowerCase() || ".jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", safeFolder);
  await mkdir(dir, { recursive: true });

  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), bytes);

  return { url: `/uploads/${safeFolder}/${filename}` };
}
