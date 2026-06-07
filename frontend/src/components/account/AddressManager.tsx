"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, Trash2, Star, Plus } from "lucide-react";
import { useAddressesStore } from "@/stores/addresses-store";
import { useAuthStore } from "@/stores/auth-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatPhoneDisplay } from "@/lib/phone";

interface AddressManagerProps {
  compact?: boolean;
}

export function AddressManager({ compact }: AddressManagerProps) {
  const t = useTranslations("account");
  const tc = useTranslations("common");
  const hydrated = useHydrated();
  const user = useAuthStore((s) => s.user);
  const { items, add, remove, setDefault } = useAddressesStore();
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ label: "", city: "", street: "" });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const label = form.label.trim();
    const city = form.city.trim();
    const street = form.street.trim();
    if (!label || !city || !street) return;

    add({
      label,
      city,
      street,
      phone: user?.phone ?? "",
    });
    setForm({ label: "", city: "", street: "" });
    setShowForm(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  if (!hydrated) {
    return (
      <div className="form-card animate-pulse">
        <div className="h-5 w-32 bg-[var(--color-border)] rounded mb-3" />
        <div className="h-16 bg-[var(--color-bg)] rounded" />
      </div>
    );
  }

  return (
    <div className={compact ? "mt-5" : ""}>
      {compact && (
        <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">
          {t("addresses")}
        </h3>
      )}

      {saved && (
        <p className="text-xs text-[var(--color-brand)] mb-3">{t("saved")}</p>
      )}

      <div className="space-y-2">
        {items.length === 0 && !showForm && (
          <p className="text-sm text-[var(--color-muted)] py-4 text-center">
            {t("noAddresses")}
          </p>
        )}
        {items.map((addr) => (
          <div
            key={addr.id}
            className={`card p-3.5 flex gap-3 ${
              addr.isDefault ? "ring-2 ring-[var(--color-brand)]/25" : ""
            }`}
          >
            <MapPin
              size={18}
              className="shrink-0 mt-0.5 text-[var(--color-brand)]"
              strokeWidth={1.75}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium flex items-center gap-2">
                {addr.label}
                {addr.isDefault && (
                  <span className="text-[10px] font-semibold uppercase text-[var(--color-brand)]">
                    {t("default")}
                  </span>
                )}
              </p>
              <p className="text-sm text-[var(--color-muted)] mt-0.5">
                {addr.city}, {addr.street}
              </p>
              {addr.phone && (
                <p className="text-xs text-[var(--color-muted)] mt-1 tabular-nums">
                  {formatPhoneDisplay(addr.phone)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              {!addr.isDefault && (
                <button
                  type="button"
                  onClick={() => setDefault(addr.id)}
                  className="icon-btn"
                  aria-label={t("setDefault")}
                >
                  <Star size={16} />
                </button>
              )}
              <button
                type="button"
                onClick={() => remove(addr.id)}
                className="icon-btn text-[var(--color-muted)] hover:text-[var(--color-sale)]"
                aria-label={tc("delete")}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm ? (
        <form onSubmit={handleAdd} className="form-card mt-3 space-y-0">
          <div className="form-field">
            <label className="input-label">{t("addressLabel")}</label>
            <input
              required
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              className="input"
              placeholder="Дом"
            />
          </div>
          <div className="form-field">
            <label className="input-label">{t("city")}</label>
            <input
              required
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              className="input"
              placeholder="Душанбе"
            />
          </div>
          <div className="form-field">
            <label className="input-label">{t("street")}</label>
            <input
              required
              value={form.street}
              onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))}
              className="input"
              placeholder="ул. Рудаки 95"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="btn btn-primary flex-1">
              {tc("save")}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn btn-secondary"
            >
              {tc("cancel")}
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="btn btn-secondary w-full mt-3 gap-2"
        >
          <Plus size={18} />
          {t("addAddress")}
        </button>
      )}
    </div>
  );
}
