import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Gallery } from "@/components/sections/gallery";
import { CustomCakeOrder } from "@/components/sections/custom-cake-order";
import { Courses } from "@/components/sections/courses";
import { Testimonials } from "@/components/sections/testimonials";
import { BrandValues } from "@/components/sections/brand-values";
import { Contact } from "@/components/sections/contact";
import { Location } from "@/components/sections/location";
import { getSiteSettings } from "@/services/settings";
import { getPublishedCourses } from "@/services/courses";
import { getPublishedMasterclasses } from "@/services/masterclasses";
import { getPublishedGalleryImages } from "@/services/gallery";
import { getPublishedTestimonials } from "@/services/testimonials";
import { getPublishedCakeSizes } from "@/services/cake-sizes";
import { getPublishedCakeStyles } from "@/services/cake-styles";
import { getPublishedCakeOccasions } from "@/services/cake-occasions";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ curso?: string }>;
}) {
  const [
    settings,
    courses,
    masterclasses,
    gallery,
    testimonials,
    cakeSizes,
    cakeStyles,
    cakeOccasions,
    params,
  ] = await Promise.all([
    getSiteSettings(),
    getPublishedCourses(),
    getPublishedMasterclasses(),
    getPublishedGalleryImages(),
    getPublishedTestimonials(),
    getPublishedCakeSizes(),
    getPublishedCakeStyles(),
    getPublishedCakeOccasions(),
    searchParams,
  ]);

  return (
    <>
      <SiteHeader whatsappUrl={settings.whatsappUrl} />
      <main>
        <Hero settings={settings} />
        <About settings={settings} />
        <Gallery images={gallery} />
        <CustomCakeOrder
          whatsappUrl={settings.whatsappUrl}
          sizes={cakeSizes}
          styles={cakeStyles}
          occasions={cakeOccasions}
        />
        <Courses courses={courses} masterclasses={masterclasses} />
        <Testimonials testimonials={testimonials} />
        <Contact
          settings={settings}
          courses={courses}
          masterclasses={masterclasses}
          defaultCourse={params.curso}
        />
        <Location settings={settings} />
        <BrandValues />
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
