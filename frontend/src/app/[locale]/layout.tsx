import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { MobileTabRouter } from "@/components/layout/MobileTabRouter";
import { MobileTabsProvider } from "@/contexts/mobile-tabs-context";
import { InstantNavProvider } from "@/contexts/instant-nav-context";
import { AccountSubProvider } from "@/contexts/account-sub-context";
import { Analytics } from "@/components/analytics/Analytics";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { SearchProvider } from "@/contexts/search-context";
import { CartModalProvider } from "@/contexts/cart-modal-context";
import { FavoritesPanelProvider } from "@/contexts/favorites-panel-context";
import { CartAddedModal } from "@/components/cart/CartAddedModal";
import { FavoritesPanel } from "@/components/favorites/FavoritesPanel";
import { FullScreenSearch } from "@/components/search/FullScreenSearch";
import "../globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/messages/${locale}.json`)).default;
  return {
    title: messages.meta.title,
    description: messages.meta.description,
    openGraph: {
      title: messages.meta.title,
      description: messages.meta.description,
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "ru" | "tj")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased max-md:h-full max-md:overflow-hidden md:pb-0">
        <OrganizationJsonLd />
        <Analytics />
        <SmoothScroll>
          <SearchProvider>
            <CartModalProvider>
              <FavoritesPanelProvider>
                <NextIntlClientProvider messages={messages}>
                  <InstantNavProvider>
                  <AccountSubProvider>
                  <MobileTabsProvider>
                    <Header />
                    <main className="flex-1 bg-[var(--color-bg)] flex flex-col min-h-0 max-md:overflow-hidden">
                      <MobileTabRouter>{children}</MobileTabRouter>
                    </main>
                    <div className="hidden md:block border-t border-[var(--color-border)]">
                      <Footer />
                    </div>
                    <MobileBottomNav />
                    <FullScreenSearch />
                    <FavoritesPanel />
                    <CartAddedModal />
                  </MobileTabsProvider>
                  </AccountSubProvider>
                  </InstantNavProvider>
                </NextIntlClientProvider>
              </FavoritesPanelProvider>
            </CartModalProvider>
          </SearchProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
