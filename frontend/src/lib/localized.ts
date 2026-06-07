import type { Locale, LocalizedString } from "@/types";

export function t(localized: LocalizedString, locale: Locale): string {
  return localized[locale] ?? localized.ru;
}
