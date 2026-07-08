"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { courseSchema, type CourseFormValues } from "@/lib/validations/course";
import {
  createCourseAction,
  updateCourseAction,
} from "@/app/admin/actions/courses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageField } from "@/components/admin/image-field";
import type { Course } from "@/types/content";

export function CourseForm({ course }: { course?: Course }) {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course?.title ?? "",
      description: course?.description ?? "",
      level: course?.level ?? "Iniciación",
      format: course?.format ?? "Presencial",
      imageUrl: course?.imageUrl ?? null,
      imagePosition: course?.imagePosition ?? null,
      startDate: course?.startDate ? course.startDate.slice(0, 10) : null,
      availablePlaces: course?.availablePlaces ?? null,
      duration: course?.duration ?? null,
      badge: course?.badge ?? null,
      price: course?.price ?? null,
      featured: course?.featured ?? false,
      published: course?.published ?? true,
    },
  });

  const imageUrl = watch("imageUrl");
  const imagePosition = watch("imagePosition");

  async function onSubmit(values: CourseFormValues) {
    const result = course
      ? await updateCourseAction(course.id, values)
      : await createCourseAction(values);
    if (result.success) {
      toast.success(course ? "Curso actualizado." : "Curso creado.");
      router.push("/admin/cursos");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-8 lg:grid-cols-[1fr_320px]"
    >
      <div className="space-y-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Título</Label>
          <Input id="title" {...register("title")} />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description">Descripción</Label>
          <Textarea id="description" rows={4} {...register("description")} />
          {errors.description && (
            <p className="text-xs text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Nivel</Label>
            <Controller
              control={control}
              name="level"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Iniciación">Iniciación</SelectItem>
                    <SelectItem value="Intermedio">Intermedio</SelectItem>
                    <SelectItem value="Avanzado">Avanzado</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Formato</Label>
            <Controller
              control={control}
              name="format"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Presencial">Presencial</SelectItem>
                    <SelectItem value="Online">Online</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="startDate">Fecha de inicio</Label>
            <Controller
              control={control}
              name="startDate"
              render={({ field }) => (
                <Input
                  id="startDate"
                  type="date"
                  value={field.value ?? ""}
                  onChange={(event) =>
                    field.onChange(event.target.value || null)
                  }
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="availablePlaces">Plazas disponibles</Label>
            <Controller
              control={control}
              name="availablePlaces"
              render={({ field }) => (
                <Input
                  id="availablePlaces"
                  type="number"
                  min={1}
                  value={field.value ?? ""}
                  onChange={(event) =>
                    field.onChange(
                      event.target.value ? Number(event.target.value) : null,
                    )
                  }
                />
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="duration">Duración</Label>
            <Controller
              control={control}
              name="duration"
              render={({ field }) => (
                <Input
                  id="duration"
                  placeholder="5 horas"
                  value={field.value ?? ""}
                  onChange={(event) =>
                    field.onChange(event.target.value || null)
                  }
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="badge">
              Insignia{" "}
              <span className="font-normal text-muted-foreground">
                (opcional)
              </span>
            </Label>
            <Controller
              control={control}
              name="badge"
              render={({ field }) => (
                <Input
                  id="badge"
                  placeholder="Nuevo"
                  value={field.value ?? ""}
                  onChange={(event) =>
                    field.onChange(event.target.value || null)
                  }
                />
              )}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="price">
            Precio{" "}
            <span className="font-normal text-muted-foreground">
              (opcional)
            </span>
          </Label>
          <Controller
            control={control}
            name="price"
            render={({ field }) => (
              <Input
                id="price"
                placeholder="150€"
                value={field.value ?? ""}
                onChange={(event) =>
                  field.onChange(event.target.value || null)
                }
              />
            )}
          />
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-border p-4">
          <Controller
            control={control}
            name="featured"
            render={({ field }) => (
              <Switch
                id="featured"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="featured">
            Destacado{" "}
            <span className="font-normal text-muted-foreground">
              (resalta el curso en la web)
            </span>
          </Label>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-border p-4">
          <Controller
            control={control}
            name="published"
            render={({ field }) => (
              <Switch
                id="published"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="published">Publicado en el sitio</Label>
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-auto rounded-full bg-foreground px-6 py-2.5 text-primary-foreground hover:bg-foreground/85"
          >
            {isSubmitting ? "Guardando..." : "Guardar curso"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-auto rounded-full px-6 py-2.5"
            onClick={() => router.push("/admin/cursos")}
          >
            Cancelar
          </Button>
        </div>
      </div>

      <div>
        <Label className="mb-1.5 block">Imagen</Label>
        <ImageField
          folder="courses"
          imageUrl={imageUrl}
          imagePosition={imagePosition}
          onImageUrlChange={(url) =>
            setValue("imageUrl", url, { shouldDirty: true })
          }
          onPositionChange={(position) =>
            setValue("imagePosition", position, { shouldDirty: true })
          }
        />
      </div>
    </form>
  );
}
