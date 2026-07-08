import { PageHeader } from "@/components/admin/page-header";
import { GalleryManager } from "@/components/admin/gallery-manager";
import { getGalleryImages } from "@/services/gallery";

export default async function AdminGalleryPage() {
  const images = await getGalleryImages();

  return (
    <div>
      <PageHeader
        title="Galería"
        description="Gestiona las fotografías que se muestran en la web."
      />
      <GalleryManager images={images} />
    </div>
  );
}
