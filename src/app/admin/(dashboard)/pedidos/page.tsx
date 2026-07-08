import { PageHeader } from "@/components/admin/page-header";
import { CakeOrdersTable } from "@/components/admin/cake-orders-table";
import { getCakeOrders } from "@/services/cake-orders";

export default async function AdminCakeOrdersPage() {
  const orders = await getCakeOrders();

  return (
    <div>
      <PageHeader
        title="Pedidos"
        description="Solicitudes de tartas a medida recibidas desde el sitio."
      />
      <CakeOrdersTable orders={orders} />
    </div>
  );
}
