import { cn } from "@/lib/utils";

type Slug = "" | "sets" | "t-shirts" | "shirts" | "pants" | "shoes" | "accessories";

const themes: Record<
  Slug,
  { from: string; to: string; accent: string; ring: string }
> = {
  "": {
    from: "#0d7a3e",
    to: "#065a2d",
    accent: "#b8f5d0",
    ring: "rgba(255,255,255,0.35)",
  },
  sets: {
    from: "#1e293b",
    to: "#0f172a",
    accent: "#94a3b8",
    ring: "rgba(148,163,184,0.4)",
  },
  "t-shirts": {
    from: "#2563eb",
    to: "#1d4ed8",
    accent: "#bfdbfe",
    ring: "rgba(191,219,254,0.45)",
  },
  shirts: {
    from: "#7c3aed",
    to: "#5b21b6",
    accent: "#ddd6fe",
    ring: "rgba(221,214,254,0.45)",
  },
  pants: {
    from: "#b45309",
    to: "#92400e",
    accent: "#fde68a",
    ring: "rgba(253,230,138,0.45)",
  },
  shoes: {
    from: "#be123c",
    to: "#9f1239",
    accent: "#fecdd3",
    ring: "rgba(254,205,211,0.45)",
  },
  accessories: {
    from: "#0891b2",
    to: "#0e7490",
    accent: "#a5f3fc",
    ring: "rgba(165,243,252,0.45)",
  },
};

function IconPaths({ slug }: { slug: Slug }) {
  const c = "currentColor";
  switch (slug) {
    case "":
      return (
        <>
          <rect x="14" y="18" width="20" height="14" rx="2" fill={c} opacity="0.9" />
          <path d="M18 18 L24 12 L34 12 L40 18" fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round" />
          <circle cx="24" cy="30" r="3" fill={c} opacity="0.5" />
          <path d="M30 26 L38 22 M30 32 L38 36" stroke={c} strokeWidth="1.75" strokeLinecap="round" />
        </>
      );
    case "sets":
      return (
        <>
          <path d="M16 14 L24 10 L32 14 L32 38 L16 38 Z" fill={c} opacity="0.85" />
          <path d="M20 18 L28 18 M20 24 L28 24 M20 30 L26 30" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          <path d="M24 10 L24 38" stroke={c} strokeWidth="1.25" opacity="0.35" />
        </>
      );
    case "t-shirts":
      return (
        <>
          <path
            d="M14 16 L20 12 L28 12 L34 16 L38 20 L34 22 L32 38 L16 38 L14 22 L10 20 Z"
            fill={c}
          />
          <path d="M20 12 L24 16 L28 12" fill="none" stroke={c} strokeWidth="1.5" opacity="0.6" />
        </>
      );
    case "shirts":
      return (
        <>
          <path d="M18 12 L24 10 L30 12 L34 18 L30 20 L28 38 L20 38 L18 20 L14 18 Z" fill={c} />
          <path d="M22 18 L26 18 M22 24 L26 24 M22 30 L25 30" stroke="#5b21b6" strokeWidth="1.25" strokeLinecap="round" opacity="0.45" />
          <circle cx="24" cy="14" r="1.25" fill={c} opacity="0.5" />
        </>
      );
    case "pants":
      return (
        <>
          <path d="M18 12 L30 12 L32 22 L28 38 L24 28 L20 38 L16 22 Z" fill={c} />
          <path d="M24 12 L24 28" stroke="#92400e" strokeWidth="1.25" opacity="0.35" />
        </>
      );
    case "shoes":
      return (
        <>
          <path
            d="M12 28 C12 24 16 22 22 22 L30 20 C36 20 38 24 38 28 L38 32 C38 35 34 36 28 36 L18 36 C14 36 12 34 12 32 Z"
            fill={c}
          />
          <path d="M14 28 L36 28" stroke="#9f1239" strokeWidth="1.5" opacity="0.35" />
          <ellipse cx="30" cy="30" rx="4" ry="2" fill={c} opacity="0.35" />
        </>
      );
    case "accessories":
      return (
        <>
          <circle cx="24" cy="22" r="8" fill="none" stroke={c} strokeWidth="2.5" />
          <circle cx="24" cy="22" r="3" fill={c} opacity="0.5" />
          <rect x="14" y="32" width="20" height="4" rx="2" fill={c} />
          <path d="M16 32 L32 32" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        </>
      );
    default:
      return null;
  }
}

export function CategoryIllustration({
  slug,
  active = false,
  className,
}: {
  slug: string;
  active?: boolean;
  className?: string;
}) {
  const key = (slug in themes ? slug : "sets") as Slug;
  const theme = themes[key === "" ? "" : key] ?? themes.sets;

  return (
    <span
      className={cn(
        "relative flex h-[3.75rem] w-[3.75rem] shrink-0 items-center justify-center rounded-2xl overflow-hidden transition-all duration-200",
        active && "ring-2 ring-offset-2 ring-offset-[var(--color-bg)] scale-[1.04]",
        className
      )}
      style={{
        background: `linear-gradient(145deg, ${theme.from} 0%, ${theme.to} 100%)`,
        boxShadow: active
          ? `0 8px 20px -6px ${theme.from}88`
          : `0 4px 12px -4px ${theme.from}55`,
        ...(active ? { ringColor: theme.from } : {}),
      }}
    >
      <span
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${theme.ring} 0%, transparent 55%)`,
        }}
      />
      <svg
        viewBox="0 0 48 48"
        className="relative h-9 w-9"
        aria-hidden
        style={{ color: theme.accent }}
      >
        <IconPaths slug={key === "" ? "" : (slug as Slug)} />
      </svg>
    </span>
  );
}
