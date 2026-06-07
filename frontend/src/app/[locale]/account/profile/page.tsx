"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Check, User } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { AccountPageHeader } from "@/components/account/AccountPageHeader";
import { AddressManager } from "@/components/account/AddressManager";
import { ProfilePageSkeleton } from "@/components/skeletons/PageSkeletons";
import { formatPhoneDisplay } from "@/lib/phone";

export default function ProfilePage() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("account");
  const tc = useTranslations("common");
  const hydrated = useHydrated();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace(`/${locale}/account`);
      return;
    }
    setName(user.name ?? "");
    setReady(true);
  }, [hydrated, user, locale, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    updateProfile({ name: name.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (!hydrated || !ready) {
    return <ProfilePageSkeleton />;
  }

  if (!user) return null;

  return (
    <div>
      <AccountPageHeader
        title={t("profile")}
        subtitle={formatPhoneDisplay(user.phone)}
      />

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-green-800 bg-green-50 border border-green-100 rounded-[var(--radius)] px-4 py-3 mb-4"
        >
          <Check size={18} className="text-green-600 shrink-0" />
          {t("saved")}
        </motion.div>
      )}

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-field">
          <label className="input-label">{t("name")}</label>
          <div className="relative">
            <User
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none"
            />
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input !pl-10"
              autoComplete="name"
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-full !min-h-[3rem] mt-2">
          {tc("save")}
        </button>
      </form>

      <AddressManager compact />
    </div>
  );
}
