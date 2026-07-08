import { PageHeader } from "@/components/admin/page-header";
import { MasterclassesTable } from "@/components/admin/masterclasses-table";
import { LinkButton } from "@/components/ui/link-button";
import { getMasterclasses } from "@/services/masterclasses";

export default async function AdminMasterclassPage() {
  const masterclasses = await getMasterclasses();

  return (
    <div>
      <PageHeader
        title="Masterclass"
        description="Gestiona las jornadas intensivas que se muestran en la web."
        action={
          <LinkButton
            href="/admin/masterclass/nuevo"
            className="h-auto rounded-full bg-foreground px-5 py-2.5 text-primary-foreground hover:bg-foreground/85"
          >
            + Nueva masterclass
          </LinkButton>
        }
      />
      <MasterclassesTable masterclasses={masterclasses} />
    </div>
  );
}
