"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  testimonialSchema,
  type TestimonialFormValues,
} from "@/lib/validations/testimonial";
import {
  createTestimonialAction,
  updateTestimonialAction,
} from "@/app/admin/actions/testimonials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageField } from "@/components/admin/image-field";
import type { Testimonial } from "@/types/content";

export function TestimonialForm({ testimonial }: { testimonial?: Testimonial }) {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      authorName: testimonial?.authorName ?? "",
      authorRole: testimonial?.authorRole ?? null,
      content: testimonial?.content ?? "",
      avatarUrl: testimonial?.avatarUrl ?? null,
      imagePosition: testimonial?.imagePosition ?? null,
      published: testimonial?.published ?? true,
    },
  });

  const avatarUrl = watch("avatarUrl");
  const imagePosition = watch("imagePosition");

  async function onSubmit(values: TestimonialFormValues) {
    const result = testimonial
      ? await updateTestimonialAction(testimonial.id, values)
      : await createTestimonialAction(values);
    if (result.success) {
      toast.success(testimonial ? "Testimonio actualizado." : "Testimonio creado.");
      router.push("/admin/testimonios");
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
          <Label htmlFor="authorName">Nombre</Label>
          <Input id="authorName" {...register("authorName")} />
          {errors.authorName && (
            <p className="text-xs text-destructive">
              {errors.authorName.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="authorRole">Rol / contexto</Label>
          <Controller
            control={control}
            name="authorRole"
            render={({ field }) => (
              <Input
                id="authorRole"
                placeholder="Alumna — Tartas de Diseño"
                value={field.value ?? ""}
                onChange={(event) => field.onChange(event.target.value || null)}
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="content">Testimonio</Label>
          <Textarea id="content" rows={5} {...register("content")} />
          {errors.content && (
            <p className="text-xs text-destructive">
              {errors.content.message}
            </p>
          )}
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
            {isSubmitting ? "Guardando..." : "Guardar testimonio"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-auto rounded-full px-6 py-2.5"
            onClick={() => router.push("/admin/testimonios")}
          >
            Cancelar
          </Button>
        </div>
      </div>

      <div>
        <Label className="mb-1.5 block">Foto</Label>
        <ImageField
          folder="testimonials"
          imageUrl={avatarUrl}
          imagePosition={imagePosition}
          ratio="square"
          onImageUrlChange={(url) =>
            setValue("avatarUrl", url, { shouldDirty: true })
          }
          onPositionChange={(position) =>
            setValue("imagePosition", position, { shouldDirty: true })
          }
        />
      </div>
    </form>
  );
}
