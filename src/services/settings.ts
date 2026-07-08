import { readSingleton, writeSingleton } from "@/lib/content-store";
import type { SiteSettings } from "@/types/content";

const FILE = "settings.json";

export async function getSiteSettings(): Promise<SiteSettings> {
  return readSingleton<SiteSettings>(FILE);
}

export async function updateSiteSettings(
  input: Partial<SiteSettings>,
): Promise<SiteSettings> {
  const current = await getSiteSettings();
  const updated = { ...current, ...input };
  await writeSingleton(FILE, updated);
  return updated;
}
