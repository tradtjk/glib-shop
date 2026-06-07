"use client";

import { HeroBanner } from "@/components/home/HeroBanner";
import { LooksSection } from "@/components/home/LooksSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { PromotionsSection } from "@/components/home/PromotionsSection";
import { CustomerVideosSection } from "@/components/home/CustomerVideosSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { StoreSection } from "@/components/home/StoreSection";
import { HomeNewArrivals, HomePopular } from "@/components/home/HomeProductSections";

export function HomeTabContent() {
  return (
    <>
      <HeroBanner />
      <LooksSection />
      <CategoriesSection />
      <PromotionsSection />
      <HomeNewArrivals />
      <CustomerVideosSection />
      <HomePopular />
      <ReviewsSection />
      <StoreSection />
      <div className="mobile-tab-end-spacer md:hidden" aria-hidden />
    </>
  );
}
