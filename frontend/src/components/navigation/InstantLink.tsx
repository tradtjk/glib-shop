"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useInstantNav } from "@/contexts/instant-nav-context";
import { useHydrated } from "@/hooks/use-hydrated";
import { useIsMobile } from "@/hooks/use-is-mobile";

type InstantLinkProps = React.ComponentProps<typeof Link>;

export function InstantLink({ href, onClick, prefetch = true, ...props }: InstantLinkProps) {
  const router = useRouter();
  const instant = useInstantNav();
  const hydrated = useHydrated();
  const isMobile = useIsMobile();
  const path = typeof href === "string" ? href : href.pathname ?? "";

  useEffect(() => {
    if (path && prefetch) router.prefetch(path);
  }, [path, prefetch, router]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (hydrated && isMobile && instant && path.startsWith("/")) {
      e.preventDefault();
      instant.navigate(path);
    }
  };

  return <Link href={href} onClick={handleClick} prefetch={prefetch} {...props} />;
}
