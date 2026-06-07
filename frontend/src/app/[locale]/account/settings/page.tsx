"use client";

import { useTranslations } from "next-intl";
import { Bell, MessageCircle, Smartphone } from "lucide-react";
import { AccountPageHeader } from "@/components/account/AccountPageHeader";

const toggles = [
  { key: "notifySms", icon: Smartphone },
  { key: "notifyTelegram", icon: MessageCircle },
  { key: "notifyPush", icon: Bell },
] as const;

export default function SettingsPage() {
  const t = useTranslations("account");

  return (
    <div>
      <AccountPageHeader title={t("settings")} />
      <div className="form-card !p-0 overflow-hidden divide-y divide-[var(--color-border)]">
        {toggles.map(({ key, icon: Icon }) => (
          <label
            key={key}
            className="flex items-center gap-3 px-4 py-3.5 cursor-pointer tap-card"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-bg)] text-[var(--color-brand)]">
              <Icon size={18} strokeWidth={1.75} />
            </span>
            <span className="flex-1 text-sm font-medium">{t(key)}</span>
            <input type="checkbox" defaultChecked={key === "notifySms"} className="h-5 w-5 accent-[var(--color-brand)]" />
          </label>
        ))}
      </div>
    </div>
  );
}
