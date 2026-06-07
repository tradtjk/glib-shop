import { setRequestLocale } from "next-intl/server";
import { MainTabPageContent } from "@/components/layout/MainTabPageContent";
import { HomeTabContent } from "@/components/tabs/HomeTabContent";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <MainTabPageContent>
      <HomeTabContent />
    </MainTabPageContent>
  );
}
