"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence } from "framer-motion";
import { Phone } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { PageHeader } from "@/components/ui/Page";
import { AccountSubPanels } from "@/components/account/AccountSubPanels";
import { useAccountSub } from "@/contexts/account-sub-context";
import { AuthSuccessOverlay } from "@/components/auth/AuthSuccessOverlay";
import { TabAccountSkeleton } from "@/components/skeletons/PageSkeletons";
import { cn } from "@/lib/utils";

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="form-field">
      <label className="input-label">{label}</label>
      {children}
    </div>
  );
}

export function AccountTabContent() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("account");
  const hydrated = useHydrated();
  const { user, register, login } = useAuthStore();
  const accountSub = useAccountSub();
  const activeSub = accountSub?.activeSub ?? "hub";
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<"login" | "register" | null>(null);

  if (!hydrated) {
    return (
      <div className="page">
        <TabAccountSkeleton />
      </div>
    );
  }

  if (user) {
    return (
      <div className="page flex flex-col min-h-0 flex-1">
        {activeSub === "hub" && (
          <PageHeader title={t("profile")} subtitle="Golib Shop" />
        )}
        <AccountSubPanels />
      </div>
    );
  }

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        const res = await register({
          phone: phone.trim(),
          password: password.trim(),
          name: name.trim(),
        });
        if (!res.ok) {
          setError(res.error ?? t("error"));
          return;
        }
        setSuccess("register");
        setTimeout(() => router.refresh(), 1600);
        return;
      }

      const res = await login(phone.trim(), password.trim());
      if (!res.ok) {
        setError(res.error ?? t("error"));
        return;
      }
      setSuccess("login");
      setTimeout(() => router.refresh(), 1600);
    } finally {
      setLoading(false);
    }
  };

  const phoneInput = (
    <div className="relative">
      <Phone
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none"
        strokeWidth={1.75}
      />
      <input
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        required
        placeholder="+992 90 123 45 67"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="input !pl-10"
      />
    </div>
  );

  return (
    <div className="page">
      <AnimatePresence>
        {success && <AuthSuccessOverlay mode={success} />}
      </AnimatePresence>

      <PageHeader
        title={mode === "login" ? t("login") : t("register")}
        subtitle={t("authSubtitle")}
      />

      <div className="flex gap-1 p-1 rounded-[var(--radius-lg)] bg-[var(--color-border)]/60 mb-5">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError("");
            }}
            className={cn(
              "flex-1 py-2.5 text-sm font-medium rounded-[var(--radius)] transition-colors",
              mode === m
                ? "bg-[var(--color-surface)] shadow-sm text-[var(--color-text)]"
                : "text-[var(--color-muted)]"
            )}
          >
            {t(m)}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-sm text-[var(--color-sale)] bg-red-50 border border-red-100 rounded-[var(--radius)] px-4 py-3 mb-4">
          {error}
        </p>
      )}

      <form className="form-card" onSubmit={handleSubmit}>
        {mode === "register" && (
          <FormField label={t("name")}>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              autoComplete="name"
            />
          </FormField>
        )}
        <FormField label={t("phone")}>{phoneInput}</FormField>
        <FormField label={t("password")}>
          <input
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
            minLength={4}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
        </FormField>
        <button
          type="submit"
          disabled={!!success || loading}
          className="btn btn-primary w-full !min-h-[3rem] mt-2"
        >
          {loading ? t("loading") : mode === "login" ? t("login") : t("register")}
        </button>
      </form>
    </div>
  );
}
