import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  accent,
  accentColor = "pink",
  description,
  align = "left",
  className,
}: {
  title: string;
  accent?: string;
  accentColor?: "pink" | "brown";
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "section-title",
        align === "center" && "text-center",
        className,
      )}
    >
      {/* Separador dorado entre el número de sección (eyebrow) y el título */}
      <hr
        aria-hidden
        className={cn(
          "my-3 w-[60px] border-t border-[#c9a84c]",
          align === "center" && "mx-auto",
        )}
      />
      <h2 className="text-balance font-heading text-3xl leading-[1.1] font-medium text-foreground md:text-5xl">
        {title}{" "}
        {accent && (
          <em
            className={cn(
              "italic",
              accentColor === "pink" ? "text-pink-ink" : "text-brown",
            )}
          >
            {accent}
          </em>
        )}
      </h2>
      {/* Subrayado rosa animado con GSAP + ScrollTrigger (ver gsap-effects.tsx) */}
      <span
        aria-hidden
        className={cn(
          "title-underline mt-2 block h-[2px] w-0 bg-[#e8a0b0] opacity-0",
          align === "center" && "mx-auto",
        )}
      />
      {description && (
        <p
          className={cn(
            "mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
