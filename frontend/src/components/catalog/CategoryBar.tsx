"use client";

import { useTranslations } from "next-intl";
import { CategoryIconRow } from "./CategoryIconRow";

interface CategoryBarProps {
  active: string;
  onChange: (slug: string) => void;
}

export function CategoryBar({ active, onChange }: CategoryBarProps) {
  const t = useTranslations("sections");

  return (
    <CategoryIconRow
      active={active}
      onChange={onChange}
      showNav
      title={t("categories")}
      subtitle={t("categoriesSubtitle")}
      className="mb-3"
    />
  );
}
