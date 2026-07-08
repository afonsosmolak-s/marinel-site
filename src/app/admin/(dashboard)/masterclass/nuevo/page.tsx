import { PageHeader } from "@/components/admin/page-header";
import { MasterclassForm } from "@/components/admin/masterclass-form";

export default function NewMasterclassPage() {
  return (
    <div>
      <PageHeader title="Nueva masterclass" />
      <MasterclassForm />
    </div>
  );
}
