"use client";

import { useTranslations } from "next-intl";
import { AccountPageHeader } from "@/components/account/AccountPageHeader";
import { AddressManager } from "@/components/account/AddressManager";

export default function AddressesPage() {
  const t = useTranslations("account");

  return (
    <div>
      <AccountPageHeader title={t("addresses")} />
      <AddressManager />
    </div>
  );
}
