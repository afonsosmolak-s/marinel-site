"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageField } from "@/components/admin/image-field";
import { updateSiteSettingsAction } from "@/app/admin/actions/settings";
import { changePasswordAction } from "@/app/admin/actions/auth";
import type { ImagePosition, SiteSettings } from "@/types/content";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  return (
    <Tabs defaultValue="general">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="imagenes">Imágenes</TabsTrigger>
        <TabsTrigger value="contacto">Contacto y redes</TabsTrigger>
        <TabsTrigger value="seo">SEO</TabsTrigger>
        <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
      </TabsList>
      <TabsContent value="general" className="mt-6">
        <GeneralForm settings={settings} />
      </TabsContent>
      <TabsContent value="imagenes" className="mt-6">
        <ImagesForm settings={settings} />
      </TabsContent>
      <TabsContent value="contacto" className="mt-6">
        <ContactForm settings={settings} />
      </TabsContent>
      <TabsContent value="seo" className="mt-6">
        <SeoForm settings={settings} />
      </TabsContent>
      <TabsContent value="seguridad" className="mt-6">
        <PasswordForm />
      </TabsContent>
    </Tabs>
  );
}

function SaveButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      className="h-auto rounded-full bg-foreground px-6 py-2.5 text-primary-foreground hover:bg-foreground/85"
    >
      {isSubmitting ? "Guardando..." : "Guardar cambios"}
    </Button>
  );
}

function GeneralForm({ settings }: { settings: SiteSettings }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      heroEyebrow: settings.heroEyebrow,
      heroTitle: settings.heroTitle,
      heroTitleAccent: settings.heroTitleAccent,
      heroSubtitle: settings.heroSubtitle,
      aboutTitle: settings.aboutTitle,
      aboutTitleAccent: settings.aboutTitleAccent,
      aboutBody: settings.aboutBody.join("\n"),
    },
  });

  async function onSubmit(values: Record<string, string>) {
    const result = await updateSiteSettingsAction({
      ...values,
      aboutBody: values.aboutBody.split("\n").filter(Boolean),
    });
    if (result.success) toast.success("Textos actualizados.");
    else toast.error(result.error);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl space-y-5 rounded-2xl border border-border bg-background p-6"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="heroEyebrow">Eyebrow del hero</Label>
        <Input id="heroEyebrow" {...register("heroEyebrow")} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="heroTitle">Título del hero</Label>
          <Input id="heroTitle" {...register("heroTitle")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="heroTitleAccent">Palabra destacada</Label>
          <Input id="heroTitleAccent" {...register("heroTitleAccent")} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="heroSubtitle">Subtítulo del hero</Label>
        <Textarea id="heroSubtitle" rows={2} {...register("heroSubtitle")} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="aboutTitle">Título — Sobre Marinel</Label>
          <Input id="aboutTitle" {...register("aboutTitle")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="aboutTitleAccent">Palabra destacada</Label>
          <Input id="aboutTitleAccent" {...register("aboutTitleAccent")} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="aboutBody">
          Texto — Sobre Marinel{" "}
          <span className="font-normal text-muted-foreground">
            (un párrafo por línea)
          </span>
        </Label>
        <Textarea id="aboutBody" rows={5} {...register("aboutBody")} />
      </div>
      <SaveButton isSubmitting={isSubmitting} />
    </form>
  );
}

function ImagesForm({ settings }: { settings: SiteSettings }) {
  const [heroImageUrl, setHeroImageUrl] = useState(settings.heroImageUrl);
  const [heroImagePosition, setHeroImagePosition] = useState<ImagePosition | null>(
    settings.heroImagePosition,
  );
  const [aboutImageUrl, setAboutImageUrl] = useState(settings.aboutImageUrl);
  const [aboutImagePosition, setAboutImagePosition] =
    useState<ImagePosition | null>(settings.aboutImagePosition);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSave() {
    setIsSubmitting(true);
    const result = await updateSiteSettingsAction({
      heroImageUrl,
      heroImagePosition,
      aboutImageUrl,
      aboutImagePosition,
    });
    setIsSubmitting(false);
    if (result.success) toast.success("Imágenes actualizadas.");
    else toast.error(result.error);
  }

  return (
    <div className="max-w-2xl space-y-8 rounded-2xl border border-border bg-background p-6">
      <div>
        <Label className="mb-2 block">Foto del Hero</Label>
        <p className="mb-3 text-xs text-muted-foreground">
          Aparece junto al titular principal, en la parte superior del sitio.
        </p>
        <ImageField
          folder="hero"
          imageUrl={heroImageUrl}
          imagePosition={heroImagePosition}
          ratio="tall"
          onImageUrlChange={setHeroImageUrl}
          onPositionChange={setHeroImagePosition}
        />
      </div>
      <div>
        <Label className="mb-2 block">Foto — Sobre Marinel</Label>
        <p className="mb-3 text-xs text-muted-foreground">
          Retrato junto a la historia y valores de Marinel.
        </p>
        <ImageField
          folder="about"
          imageUrl={aboutImageUrl}
          imagePosition={aboutImagePosition}
          ratio="tall"
          onImageUrlChange={setAboutImageUrl}
          onPositionChange={setAboutImagePosition}
        />
      </div>
      <Button
        type="button"
        onClick={onSave}
        disabled={isSubmitting}
        className="h-auto rounded-full bg-foreground px-6 py-2.5 text-primary-foreground hover:bg-foreground/85"
      >
        {isSubmitting ? "Guardando..." : "Guardar cambios"}
      </Button>
    </div>
  );
}

function ContactForm({ settings }: { settings: SiteSettings }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      instagramUrl: settings.instagramUrl,
      tiktokUrl: settings.tiktokUrl,
      whatsappUrl: settings.whatsappUrl,
      whatsappNumber: settings.whatsappNumber,
      communityUrl: settings.communityUrl,
      phone: settings.phone,
      email: settings.email,
      city: settings.city,
      address: settings.address,
      mapEmbedUrl: settings.mapEmbedUrl,
    },
  });

  async function onSubmit(values: Record<string, string>) {
    const result = await updateSiteSettingsAction(values);
    if (result.success) toast.success("Datos de contacto actualizados.");
    else toast.error(result.error);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl space-y-5 rounded-2xl border border-border bg-background p-6"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="instagramUrl">Instagram</Label>
          <Input id="instagramUrl" {...register("instagramUrl")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tiktokUrl">TikTok</Label>
          <Input id="tiktokUrl" {...register("tiktokUrl")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="whatsappUrl">Enlace de WhatsApp</Label>
          <Input id="whatsappUrl" {...register("whatsappUrl")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="whatsappNumber">Número visible</Label>
          <Input id="whatsappNumber" {...register("whatsappNumber")} />
        </div>
        <div className="col-span-2 flex flex-col gap-1.5">
          <Label htmlFor="communityUrl">Comunidad de WhatsApp</Label>
          <Input id="communityUrl" {...register("communityUrl")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" {...register("phone")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="city">Ciudad</Label>
          <Input id="city" {...register("city")} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="address">Dirección del obrador</Label>
        <Input id="address" {...register("address")} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="mapEmbedUrl">
          URL de mapa incrustado{" "}
          <span className="font-normal text-muted-foreground">
            (opcional)
          </span>
        </Label>
        <Input id="mapEmbedUrl" {...register("mapEmbedUrl")} />
      </div>
      <SaveButton isSubmitting={isSubmitting} />
    </form>
  );
}

function SeoForm({ settings }: { settings: SiteSettings }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      seoTitle: settings.seoTitle,
      seoDescription: settings.seoDescription,
    },
  });

  async function onSubmit(values: Record<string, string>) {
    const result = await updateSiteSettingsAction(values);
    if (result.success) toast.success("SEO actualizado.");
    else toast.error(result.error);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl space-y-5 rounded-2xl border border-border bg-background p-6"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="seoTitle">Título SEO</Label>
        <Input id="seoTitle" {...register("seoTitle")} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="seoDescription">Descripción SEO</Label>
        <Textarea id="seoDescription" rows={3} {...register("seoDescription")} />
      </div>
      <SaveButton isSubmitting={isSubmitting} />
    </form>
  );
}

function PasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) {
    if (values.newPassword !== values.confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }
    const result = await changePasswordAction(values);
    if (result.success) {
      toast.success("Contraseña actualizada.");
      reset();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md space-y-5 rounded-2xl border border-border bg-background p-6"
    >
      <p className="text-sm text-muted-foreground">
        Cambia la contraseña de acceso al panel de administración.
      </p>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="currentPassword">Contraseña actual</Label>
        <Input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          {...register("currentPassword")}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="newPassword">Contraseña nueva</Label>
        <Input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          {...register("newPassword")}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirmPassword">Repite la contraseña nueva</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword")}
        />
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-auto rounded-full bg-foreground px-6 py-2.5 text-primary-foreground hover:bg-foreground/85"
      >
        {isSubmitting ? "Guardando..." : "Cambiar contraseña"}
      </Button>
    </form>
  );
}
