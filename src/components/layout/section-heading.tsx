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
    <div className={cn(align === "center" && "text-center", className)}>
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
