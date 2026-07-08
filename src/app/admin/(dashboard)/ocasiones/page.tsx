import { PageHeader } from "@/components/admin/page-header";
import { CakeOccasionsManager } from "@/components/admin/cake-occasions-manager";
import { getCakeOccasions } from "@/services/cake-occasions";

export default async function AdminCakeOccasionsPage() {
  const occasions = await getCakeOccasions();

  return (
    <div>
      <PageHeader
        title="Ocasiones"
        description="Gestiona las ocasiones disponibles en el formulario de tartas a medida."
      />
      <CakeOccasionsManager occasions={occasions} />
    </div>
  );
}
