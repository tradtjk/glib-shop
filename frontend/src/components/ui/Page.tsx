import { cn } from "@/lib/utils";

export function Page({
  children,
  className,
  wide,
}: {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        "page w-full min-w-0 min-h-[50vh] bg-[var(--color-bg)]",
        wide && "md:max-w-none",
        className
      )}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="page-header flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-sub">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}

export function SectionBlock({
  title,
  subtitle,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("section", className)}>
      {(title || subtitle) && (
        <div className="mb-3 md:mb-5">
          {title && <h2 className="section-title">{title}</h2>}
          {subtitle && <p className="section-sub">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
