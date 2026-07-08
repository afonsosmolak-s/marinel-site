import Link from "next/link";
import { CalendarDays, Clock, Tag, Users } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionEyebrow } from "@/components/layout/section-eyebrow";
import { SectionHeading } from "@/components/layout/section-heading";
import { MediaPlaceholder } from "@/components/media-placeholder";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group";
import { cn, formatDate } from "@/lib/utils";
import type { Course, Masterclass } from "@/types/content";

export function Courses({
  courses,
  masterclasses,
}: {
  courses: Course[];
  masterclasses: Masterclass[];
}) {
  return (
    <section id="cursos" className="bg-section-b py-24 md:py-36">
      <Container>
        <Reveal>
          <SectionEyebrow
            index="05"
            label="Cursos y Masterclasses"
            className="mb-6"
          />
          <SectionHeading
            title="Aprende a tu"
            accent="propio ritmo."
            accentColor="pink"
            description="Formación presencial y online para cada nivel, más jornadas intensivas de cupo reducido para ir más allá: desde tus primeros pasos hasta un acabado profesional."
          />
        </Reveal>

        <StaggerGroup className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <StaggerItem key={`course-${course.id}`}>
              <div className="group relative h-full">
              <article
                className={cn(
                  "relative flex h-full flex-col overflow-hidden rounded-3xl border bg-card shadow-[4px_4px_10px_rgba(0,0,0,0.18),_10px_10px_30px_rgba(0,0,0,0.10)] transition-[transform,box-shadow] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5 group-hover:scale-[1.015] group-hover:shadow-[6px_6px_14px_rgba(0,0,0,0.22),_14px_14px_40px_rgba(0,0,0,0.14)]",
                  course.featured
                    ? "border-pink/50 shadow-[0_20px_60px_-24px_rgba(248,183,197,0.4)]"
                    : "border-border",
                )}
              >
                <div className="relative">
                  <MediaPlaceholder
                    src={course.imageUrl}
                    position={course.imagePosition}
                    alt={course.title}
                    ratio="landscape"
                    className="rounded-none border-none"
                  />
                  {course.badge && (
                    <span className="absolute top-3 right-3 rounded-full bg-foreground px-3 py-1 text-[0.65rem] font-medium tracking-wide text-primary-foreground uppercase">
                      {course.badge}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-pink-tint px-3 py-1 text-[0.65rem] font-medium tracking-wide text-pink-ink uppercase">
                      {course.level}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {course.format}
                    </span>
                  </div>
                  <h3 className="mt-4 font-heading text-xl font-medium text-foreground">
                    {course.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                    {course.description}
                  </p>

                  {(course.startDate ||
                    course.availablePlaces != null ||
                    course.duration ||
                    course.price) && (
                    <div className="mt-4 space-y-2 border-y border-border py-4 text-xs text-muted-foreground">
                      {course.startDate && (
                        <p className="flex items-center gap-1.5">
                          <CalendarDays
                            className="size-3.5 shrink-0"
                            strokeWidth={1.5}
                          />
                          Inicio: {formatDate(course.startDate)}
                        </p>
                      )}
                      {course.availablePlaces != null && (
                        <p className="flex items-center gap-1.5">
                          <Users
                            className="size-3.5 shrink-0"
                            strokeWidth={1.5}
                          />
                          {course.availablePlaces} plazas disponibles
                        </p>
                      )}
                      {course.duration && (
                        <p className="flex items-center gap-1.5">
                          <Clock
                            className="size-3.5 shrink-0"
                            strokeWidth={1.5}
                          />
                          Duración: {course.duration}
                        </p>
                      )}
                      {course.price && (
                        <p className="flex items-center gap-1.5">
                          <Tag
                            className="size-3.5 shrink-0"
                            strokeWidth={1.5}
                          />
                          {course.price}
                        </p>
                      )}
                    </div>
                  )}

                  <Link
                    href={`/?curso=${encodeURIComponent(course.title)}#contacto`}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "mt-6 h-auto w-fit rounded-full px-5 py-2.5 hover:bg-pink-tint hover:text-pink-ink",
                    )}
                  >
                    Quiero este curso
                  </Link>
                </div>
              </article>
              </div>
            </StaggerItem>
          ))}

          {masterclasses.map((masterclass) => (
            <StaggerItem key={`masterclass-${masterclass.id}`}>
              <div className="group relative h-full">
              <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[4px_4px_10px_rgba(0,0,0,0.18),_10px_10px_30px_rgba(0,0,0,0.10)] transition-[transform,box-shadow] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5 group-hover:scale-[1.015] group-hover:shadow-[6px_6px_14px_rgba(0,0,0,0.22),_14px_14px_40px_rgba(0,0,0,0.14)]">
                <MediaPlaceholder
                  src={masterclass.imageUrl}
                  position={masterclass.imagePosition}
                  alt={masterclass.title}
                  ratio="landscape"
                  tone="warm"
                  className="rounded-none border-none"
                />
                <div className="flex flex-1 flex-col p-6">
                  <span className="w-fit rounded-full bg-brown/10 px-3 py-1 text-[0.65rem] font-medium tracking-wide text-brown uppercase">
                    Masterclass
                  </span>
                  <h3 className="mt-4 font-heading text-xl font-medium text-foreground">
                    {masterclass.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                    {masterclass.description}
                  </p>

                  <div className="mt-4 space-y-2 border-y border-border py-4 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1.5">
                      <CalendarDays
                        className="size-3.5 shrink-0"
                        strokeWidth={1.5}
                      />
                      {masterclass.date
                        ? `Fecha: ${formatDate(masterclass.date)}`
                        : "Próximamente"}
                    </p>
                    {masterclass.capacity && (
                      <p className="flex items-center gap-1.5">
                        <Users
                          className="size-3.5 shrink-0"
                          strokeWidth={1.5}
                        />
                        Plazas limitadas · {masterclass.capacity} alumnas
                      </p>
                    )}
                  </div>

                  <Link
                    href={`/?curso=${encodeURIComponent(masterclass.title)}#contacto`}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "mt-6 h-auto w-fit rounded-full px-5 py-2.5 hover:bg-pink-tint hover:text-pink-ink",
                    )}
                  >
                    Reservar plaza
                  </Link>
                </div>
              </article>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
}
