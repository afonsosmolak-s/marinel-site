import { Button, buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

interface LinkButtonProps extends VariantProps<typeof buttonVariants> {
  href: string;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}

// Base UI's Button defaults to expecting a native <button> in `render`; every
// link-styled-as-button needs `nativeButton={false}` or it warns at runtime.
// Centralized here so that rule can't be forgotten at each call site.
export function LinkButton({
  href,
  external,
  variant,
  size,
  className,
  children,
}: LinkButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      nativeButton={false}
      render={
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        />
      }
      className={className}
    >
      {children}
    </Button>
  );
}
