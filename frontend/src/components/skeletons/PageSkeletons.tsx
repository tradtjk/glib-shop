"use client";

import { Shimmer, ShimmerImage } from "@/components/ui/Shimmer";

function SkeletonWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="page animate-in fade-in duration-200">{children}</div>
  );
}

export function TabHomeSkeleton() {
  return (
    <SkeletonWrap>
      <Shimmer className="h-48 w-full rounded-none -mx-[var(--page-x)] mb-4" />
      <div className="catalog-hscroll mb-6">
        <div className="catalog-hscroll-track">
          {[1, 2, 3].map((i) => (
            <Shimmer key={i} className="catalog-col-w aspect-[3/4] shrink-0 rounded-[var(--radius-lg)]" />
          ))}
        </div>
      </div>
      <div className="catalog-hscroll mb-6">
        <div className="catalog-hscroll-track">
          {[1, 2, 3, 4, 5].map((i) => (
            <Shimmer key={i} className="h-16 w-16 shrink-0 rounded-2xl" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 w-full min-w-0">
        {[1, 2, 3, 4].map((i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </SkeletonWrap>
  );
}

export function TabCatalogSkeleton() {
  return (
    <SkeletonWrap>
      <Shimmer className="h-7 w-32 mb-2" />
      <Shimmer className="h-4 w-24 mb-4" />
      <Shimmer className="h-11 w-full mb-3 rounded-[var(--radius-lg)]" />
      <div className="flex gap-3 overflow-hidden mb-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Shimmer key={i} className="h-16 w-16 shrink-0 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 w-full min-w-0">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </SkeletonWrap>
  );
}

export function TabCartSkeleton() {
  return (
    <SkeletonWrap>
      <Shimmer className="h-7 w-28 mb-6" />
      {[1, 2].map((i) => (
        <div key={i} className="flex gap-3 mb-3 p-3 rounded-[var(--radius-lg)] border border-[var(--color-border)]">
          <Shimmer className="h-20 w-16 shrink-0 rounded" />
          <div className="flex-1 space-y-2 py-1">
            <Shimmer className="h-4 w-full" />
            <Shimmer className="h-3 w-2/3" />
            <Shimmer className="h-8 w-24" />
          </div>
        </div>
      ))}
      <Shimmer className="h-28 w-full mt-4 rounded-[var(--radius-lg)]" />
    </SkeletonWrap>
  );
}

export function TabAccountSkeleton() {
  return (
    <SkeletonWrap>
      <div className="flex items-center gap-4 p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] mb-5">
        <Shimmer className="h-14 w-14 shrink-0 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-3 w-20" />
          <Shimmer className="h-5 w-36" />
          <Shimmer className="h-4 w-28" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Shimmer key={i} className="h-14 w-full rounded-[var(--radius-lg)]" />
        ))}
      </div>
    </SkeletonWrap>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <ShimmerImage />
      <Shimmer className="h-3.5 w-full" />
      <Shimmer className="h-4 w-16" />
      <Shimmer className="h-9 w-full rounded-[var(--radius)]" />
    </div>
  );
}

export function ProductPageSkeleton() {
  return (
    <SkeletonWrap>
      <ShimmerImage aspect="aspect-square" className="rounded-none -mx-[var(--page-x)] w-[calc(100%+2*var(--page-x))]" />
      <div className="pt-4 space-y-3">
        <Shimmer className="h-4 w-20" />
        <Shimmer className="h-6 w-[85%]" />
        <Shimmer className="h-8 w-28" />
        <div className="flex gap-2 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <Shimmer key={i} className="h-10 w-10 rounded-lg" />
          ))}
        </div>
        <Shimmer className="h-20 w-full mt-4" />
      </div>
      <div className="grid grid-cols-2 gap-2 mt-8">
        {[1, 2].map((i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </SkeletonWrap>
  );
}

export function ProfilePageSkeleton() {
  return (
    <SkeletonWrap>
      <div className="flex items-center gap-2 mb-5">
        <Shimmer className="h-10 w-10 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-5 w-32" />
          <Shimmer className="h-3 w-24" />
        </div>
      </div>
      <div className="space-y-4 p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)]">
        <Shimmer className="h-12 w-full" />
        <Shimmer className="h-12 w-full" />
        <Shimmer className="h-12 w-full" />
        <Shimmer className="h-12 w-full rounded-[var(--radius)]" />
      </div>
    </SkeletonWrap>
  );
}

export function GenericPageSkeleton() {
  return (
    <SkeletonWrap>
      <Shimmer className="h-7 w-40 mb-4" />
      <Shimmer className="h-4 w-full mb-2" />
      <Shimmer className="h-4 w-[90%] mb-2" />
      <Shimmer className="h-4 w-[70%] mb-6" />
      <div className="grid grid-cols-2 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </SkeletonWrap>
  );
}
