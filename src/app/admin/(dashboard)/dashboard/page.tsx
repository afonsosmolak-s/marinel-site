import Link from "next/link";
import {
  BookOpen,
  CakeSlice,
  CalendarDays,
  Inbox,
  Quote,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { LeadStatusBadge } from "@/components/admin/status-badge";
import { LinkButton } from "@/components/ui/link-button";
import { getLeads } from "@/services/leads";
import { getCourses } from "@/services/courses";
import { getMasterclasses } from "@/services/masterclasses";
import { getTestimonials } from "@/services/testimonials";
import { getCakeOrders } from "@/services/cake-orders";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [leads, courses, masterclasses, testimonials, cakeOrders] =
    await Promise.all([
      getLeads(),
      getCourses(),
      getMasterclasses(),
      getTestimonials(),
      getCakeOrders(),
    ]);

  const newLeadsCount = leads.filter((lead) => lead.status === "nuevo").length;
  const pendingOrdersCount = cakeOrders.filter(
    (order) => order.status === "pendiente",
  ).length;
  const publishedCoursesCount = courses.filter((course) => course.published).length;
  const nextMasterclass = masterclasses
    .filter((item) => item.published && item.date)
    .sort(
      (a, b) =>
        new Date(a.date as string).getTime() -
        new Date(b.date as string).getTime(),
    )[0];
  const recentLeads = leads.slice(0, 5);

  return (
    <div>
      <PageHeader title="Panel" description="Resumen de la actividad reciente." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          icon={CakeSlice}
          label="Pedidos pendientes"
          value={pendingOrdersCount}
        />
        <StatCard icon={Inbox} label="Solicitudes nuevas" value={newLeadsCount} />
        <StatCard
          icon={BookOpen}
          label="Cursos publicados"
          value={publishedCoursesCount}
        />
        <StatCard
          icon={CalendarDays}
          label="Próxima masterclass"
          value={nextMasterclass?.date ? formatDate(nextMasterclass.date) : "—"}
        />
        <StatCard icon={Quote} label="Testimonios" value={testimonials.length} />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-xl text-foreground">
              Últimas solicitudes
            </h2>
            <Link
              href="/admin/formularios"
              className="text-sm text-pink-ink hover:underline"
            >
              Ver todas
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Aún no hay solicitudes.
            </p>
          ) : (
            <div className="divide-y divide-border rounded-2xl border border-border bg-background">
              {recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href="/admin/formularios"
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-muted"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {lead.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lead.courseInterest} · {formatDate(lead.createdAt)}
                    </p>
                  </div>
                  <LeadStatusBadge status={lead.status} />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-4 font-heading text-xl text-foreground">
            Accesos rápidos
          </h2>
          <div className="grid gap-3">
            <LinkButton
              href="/admin/cursos/nuevo"
              variant="outline"
              className="h-auto justify-start rounded-2xl px-5 py-4"
            >
              + Nuevo curso
            </LinkButton>
            <LinkButton
              href="/admin/masterclass/nuevo"
              variant="outline"
              className="h-auto justify-start rounded-2xl px-5 py-4"
            >
              + Nueva masterclass
            </LinkButton>
            <LinkButton
              href="/admin/testimonios/nuevo"
              variant="outline"
              className="h-auto justify-start rounded-2xl px-5 py-4"
            >
              + Nuevo testimonio
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
}
