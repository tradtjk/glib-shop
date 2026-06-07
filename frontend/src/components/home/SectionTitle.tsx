import type { ReactNode } from "react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function SectionTitle({ title, subtitle, action }: SectionTitleProps) {
  return (
    <div className="mb-4 md:mb-5 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <span className="section-accent" aria-hidden />
        {subtitle && <p className="section-sub">{subtitle}</p>}
        <h2 className="section-title">{title}</h2>
      </div>
      {action}
    </div>
  );
}
