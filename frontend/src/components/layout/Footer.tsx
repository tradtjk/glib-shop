"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-white mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link
              href={`/${locale}`}
              className="text-2xl font-bold tracking-[0.2em] uppercase"
            >
              Golib
            </Link>
            <p className="mt-4 text-sm text-white/60 max-w-sm leading-relaxed">
              {locale === "ru"
                ? "Премиальная одежда для современного стиля жизни."
                : "Либоси премиум барои усули зиндагии муосир."}
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest mb-4 text-white/40">
              Shop
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href={`/${locale}/catalog`}>{nav("catalog")}</Link>
              </li>
              <li>
                <Link href={`/${locale}/catalog?sort=new`}>{nav("new")}</Link>
              </li>
              <li>
                <Link href={`/${locale}#store`}>{nav("store")}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest mb-4 text-white/40">
              Account
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href={`/${locale}/account`}>{nav("profile")}</Link>
              </li>
              <li>
                <Link href={`/${locale}/account/favorites`}>
                  {nav("favorites")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/cart`}>{nav("cart")}</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4 text-xs text-white/50">
          <p>{t("rights", { year })}</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">
              {t("privacy")}
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
