import { cn } from "@/lib/utils";

export function Shimmer({
  className,
}: {
  className?: string;
}) {
  return (
    <span
      className={cn("shimmer block rounded-[var(--radius)]", className)}
      aria-hidden
    />
  );
}

export function ShimmerImage({
  className,
  aspect = "aspect-[3/4]",
}: {
  className?: string;
  aspect?: string;
}) {
  return <Shimmer className={cn("w-full", aspect, className)} />;
}
