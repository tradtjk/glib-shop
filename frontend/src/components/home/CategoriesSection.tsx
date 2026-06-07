"use client";

import { useTranslations } from "next-intl";
import { CategoryIconRow } from "@/components/catalog/CategoryIconRow";
import { CatalogInset } from "@/components/layout/CatalogInset";

export function CategoriesSection() {
  const t = useTranslations("sections");

  return (
    <section className="section w-full min-w-0">
      <CatalogInset>
        <CategoryIconRow
          linkMode
          showNav
          title={t("categories")}
          subtitle={t("categoriesSubtitle")}
        />
      </CatalogInset>
    </section>
  );
}
