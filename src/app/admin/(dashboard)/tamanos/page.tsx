import { PageHeader } from "@/components/admin/page-header";
import { CakeSizesManager } from "@/components/admin/cake-sizes-manager";
import { getCakeSizes } from "@/services/cake-sizes";

export default async function AdminCakeSizesPage() {
  const sizes = await getCakeSizes();

  return (
    <div>
      <PageHeader
        title="Tamaños de Tarta"
        description="Gestiona los tamaños disponibles en el formulario de tartas a medida."
      />
      <CakeSizesManager sizes={sizes} />
    </div>
  );
}
