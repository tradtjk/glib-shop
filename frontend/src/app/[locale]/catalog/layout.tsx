import { Suspense } from "react";

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<div className="py-24 text-center text-sm text-black/40">...</div>}>{children}</Suspense>;
}
