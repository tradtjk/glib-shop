import { cn } from "@/lib/utils";

/** Same horizontal width + padding as catalog `.page` content area. */
export function CatalogInset({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("catalog-inset w-full min-w-0", className)}>
      {children}
    </div>
  );
}
