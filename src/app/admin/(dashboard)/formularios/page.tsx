import { PageHeader } from "@/components/admin/page-header";
import { LeadsTable } from "@/components/admin/leads-table";
import { getLeads } from "@/services/leads";

export default async function AdminLeadsPage() {
  const leads = await getLeads();

  return (
    <div>
      <PageHeader
        title="Formularios"
        description="Solicitudes recibidas a través del formulario de contacto."
      />
      <LeadsTable leads={leads} />
    </div>
  );
}
