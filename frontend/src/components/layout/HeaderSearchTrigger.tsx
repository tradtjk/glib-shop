"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useSearchOverlay } from "@/contexts/search-context";

export function HeaderSearchTrigger({ className }: { className?: string }) {
  const t = useTranslations("search");
  const { openSearch } = useSearchOverlay();

  return (
    <motion.button
      type="button"
      onClick={openSearch}
      className={className ?? "header-search-pill"}
      aria-label={t("placeholder")}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
    >
      <Search size={15} strokeWidth={2} className="shrink-0 text-[var(--color-muted)]" />
      <span className="truncate text-[11px] font-medium text-[var(--color-muted)]">
        {t("placeholder")}
      </span>
    </motion.button>
  );
}
