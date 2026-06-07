"use client";

import { getRouteSkeletonType } from "@/lib/route-skeleton";
import {
  GenericPageSkeleton,
  ProductPageSkeleton,
  ProfilePageSkeleton,
  TabAccountSkeleton,
  TabCartSkeleton,
  TabCatalogSkeleton,
  TabHomeSkeleton,
} from "./PageSkeletons";

export function RouteSkeleton({
  pathname,
  locale,
}: {
  pathname: string;
  locale: string;
}) {
  const type = getRouteSkeletonType(pathname, locale);

  switch (type) {
    case "product":
      return <ProductPageSkeleton />;
    case "profile":
      return <ProfilePageSkeleton />;
    case "tab-home":
      return <TabHomeSkeleton />;
    case "tab-catalog":
      return <TabCatalogSkeleton />;
    case "tab-cart":
      return <TabCartSkeleton />;
    case "tab-account":
      return <TabAccountSkeleton />;
    default:
      return <GenericPageSkeleton />;
  }
}
