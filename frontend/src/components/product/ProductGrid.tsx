import { PRODUCT_GRID_CLASS } from "@/lib/product-grid";
import { cn } from "@/lib/utils";

export function ProductGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(PRODUCT_GRID_CLASS, className)}>{children}</div>;
}
