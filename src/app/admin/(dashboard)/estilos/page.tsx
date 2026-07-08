import { PageHeader } from "@/components/admin/page-header";
import { CakeStylesManager } from "@/components/admin/cake-styles-manager";
import { getCakeStyles } from "@/services/cake-styles";

export default async function AdminCakeStylesPage() {
  const styles = await getCakeStyles();

  return (
    <div>
      <PageHeader
        title="Estilos de Tarta"
        description="Gestiona los estilos disponibles en el formulario de tartas a medida."
      />
      <CakeStylesManager styles={styles} />
    </div>
  );
}
