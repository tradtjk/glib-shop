import { AccountNav } from "@/components/account/AccountNav";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page min-h-[50vh] md:max-w-4xl md:mx-auto">
      <div className="account-grid md:grid-cols-3 md:gap-8">
        <aside className="hidden md:block md:col-span-1 md:sticky md:top-16 md:self-start">
          <AccountNav />
        </aside>
        <div className="md:col-span-2 min-w-0">{children}</div>
      </div>
    </div>
  );
}
