"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  masterclassSchema,
  type MasterclassFormValues,
} from "@/lib/validations/masterclass";
import {
  createMasterclassAction,
  updateMasterclassAction,
} from "@/app/admin/actions/masterclasses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageField } from "@/components/admin/image-field";
import type { Masterclass } from "@/types/content";

export function MasterclassForm({
  masterclass,
}: {
  masterclass?: Masterclass;
}) {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MasterclassFormValues>({
    resolver: zodResolver(masterclassSchema),
    defaultValues: {
      title: masterclass?.title ?? "",
      description: masterclass?.description ?? "",
      date: masterclass?.date ? masterclass.date.slice(0, 10) : null,
      location: masterclass?.location ?? null,
      imageUrl: masterclass?.imageUrl ?? null,
      imagePosition: masterclass?.imagePosition ?? null,
      capacity: masterclass?.capacity ?? null,
      published: masterclass?.published ?? true,
    },
  });

  const imageUrl = watch("imageUrl");
  const imagePosition = watch("imagePosition");

  async function onSubmit(values: MasterclassFormValues) {
    const result = masterclass
      ? await updateMasterclassAction(masterclass.id, values)
      : await createMasterclassAction(values);
    if (result.success) {
      toast.success(masterclass ? "Masterclass actualizada." : "Masterclass creada.");
      router.push("/admin/masterclass");
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
            <Label htmlFor="date">
              Fecha{" "}
              <span className="font-normal text-muted-foreground">
                (vacío = &quot;Próximamente&quot;)
              </span>
            </Label>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <Input
                  id="date"
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
            <Label htmlFor="capacity">Plazas</Label>
            <Controller
              control={control}
              name="capacity"
              render={({ field }) => (
                <Input
                  id="capacity"
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

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="location">Lugar</Label>
          <Controller
            control={control}
            name="location"
            render={({ field }) => (
              <Input
                id="location"
                value={field.value ?? ""}
                onChange={(event) => field.onChange(event.target.value || null)}
              />
            )}
          />
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
          <Label htmlFor="published">Publicada en el sitio</Label>
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-auto rounded-full bg-foreground px-6 py-2.5 text-primary-foreground hover:bg-foreground/85"
          >
            {isSubmitting ? "Guardando..." : "Guardar masterclass"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-auto rounded-full px-6 py-2.5"
            onClick={() => router.push("/admin/masterclass")}
          >
            Cancelar
          </Button>
        </div>
      </div>

      <div>
        <Label className="mb-1.5 block">Imagen</Label>
        <ImageField
          folder="masterclasses"
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
