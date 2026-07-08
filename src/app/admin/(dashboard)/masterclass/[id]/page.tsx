import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { MasterclassForm } from "@/components/admin/masterclass-form";
import { getMasterclassById } from "@/services/masterclasses";

export default async function EditMasterclassPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const masterclass = await getMasterclassById(id);
  if (!masterclass) notFound();

  return (
    <div>
      <PageHeader title={masterclass.title} />
      <MasterclassForm masterclass={masterclass} />
    </div>
  );
}
