import { PageHeader } from "@/components/admin/page-header";
import { CakeCatalogManager } from "@/components/admin/cake-catalog-manager";
import { getCakeFillings } from "@/services/cake-fillings";
import {
  createCakeFillingAction,
  deleteCakeFillingAction,
  reorderCakeFillingsAction,
  toggleCakeFillingPublishedAction,
  updateCakeFillingAction,
} from "@/app/admin/actions/cake-fillings";

export default async function AdminCakeFillingsPage() {
  const fillings = await getCakeFillings();

  return (
    <div>
      <PageHeader
        title="Rellenos"
        description="Gestiona los rellenos disponibles en el formulario de tartas a medida."
      />
      <CakeCatalogManager
        items={fillings}
        variant="relleno"
        uploadFolder="rellenos"
        labels={{
          singular: "relleno",
          addButton: "Añadir relleno",
          emptyTitle: "Aún no hay rellenos",
          emptyDescription: "Añade el primer relleno disponible.",
        }}
        actions={{
          create: createCakeFillingAction,
          update: updateCakeFillingAction,
          remove: deleteCakeFillingAction,
          toggle: toggleCakeFillingPublishedAction,
          reorder: reorderCakeFillingsAction,
        }}
      />
    </div>
  );
}
