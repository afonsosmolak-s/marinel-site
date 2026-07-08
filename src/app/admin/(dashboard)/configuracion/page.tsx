import { PageHeader } from "@/components/admin/page-header";
import { SettingsForm } from "@/components/admin/settings-form";
import { getSiteSettings } from "@/services/settings";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <PageHeader
        title="Configuración"
        description="Textos, contacto y SEO del sitio."
      />
      <SettingsForm settings={settings} />
    </div>
  );
}
