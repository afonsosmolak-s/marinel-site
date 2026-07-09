import { PageHeader } from "@/components/admin/page-header";
import { CakeCatalogManager } from "@/components/admin/cake-catalog-manager";
import { getCakeFlavours } from "@/services/cake-flavours";
import {
  createCakeFlavourAction,
  deleteCakeFlavourAction,
  reorderCakeFlavoursAction,
  toggleCakeFlavourPublishedAction,
  updateCakeFlavourAction,
} from "@/app/admin/actions/cake-flavours";

export default async function AdminCakeFlavoursPage() {
  const flavours = await getCakeFlavours();

  return (
    <div>
      <PageHeader
        title="Bizcochos"
        description="Gestiona los bizcochos disponibles en el formulario de tartas a medida."
      />
      <CakeCatalogManager
        items={flavours}
        variant="bizcocho"
        uploadFolder="bizcochos"
        labels={{
          singular: "bizcocho",
          addButton: "Añadir bizcocho",
          emptyTitle: "Aún no hay bizcochos",
          emptyDescription: "Añade el primer bizcocho disponible.",
        }}
        actions={{
          create: createCakeFlavourAction,
          update: updateCakeFlavourAction,
          remove: deleteCakeFlavourAction,
          toggle: toggleCakeFlavourPublishedAction,
          reorder: reorderCakeFlavoursAction,
        }}
      />
    </div>
  );
}
