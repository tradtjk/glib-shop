"use client";



import { useEffect, useState } from "react";

import Link from "next/link";

import { useLocale, useTranslations } from "next-intl";

import { Check, Loader2 } from "lucide-react";

import { useCartStore } from "@/stores/cart-store";

import { useAuthStore } from "@/stores/auth-store";

import { useAddressesStore } from "@/stores/addresses-store";

import { useOrdersStore } from "@/stores/orders-store";

import { submitOrderToApi } from "@/lib/api";

import { t as localized } from "@/lib/localized";

import { formatPrice } from "@/lib/utils";

import { Page, PageHeader } from "@/components/ui/Page";

import { cn } from "@/lib/utils";

import type { Locale } from "@/types";



function generateLocalOrderNumber() {

  return `GLB-${Date.now().toString(36).toUpperCase().slice(-6)}`;

}



export default function CheckoutPage() {

  const locale = useLocale() as Locale;

  const t = useTranslations("checkout");

  const { items, total, clear, promoCode } = useCartStore();

  const user = useAuthStore((s) => s.user);

  const token = useAuthStore((s) => s.token);

  const defaultAddress = useAddressesStore((s) =>

    s.items.find((a) => a.isDefault)

  );

  const addOrder = useOrdersStore((s) => s.addOrder);

  const syncFromApi = useOrdersStore((s) => s.syncFromApi);

  const [submitted, setSubmitted] = useState(false);

  const [orderNumber, setOrderNumber] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [submitError, setSubmitError] = useState("");

  const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery">("delivery");

  const [form, setForm] = useState({

    name: "",

    phone: "",

    city: "",

    address: "",

    comment: "",

  });



  useEffect(() => {

    setForm((f) => ({

      ...f,

      name: user?.name ?? f.name,

      phone: user?.phone ?? f.phone,

      city: defaultAddress?.city ?? f.city,

      address: defaultAddress?.street ?? f.address,

    }));

  }, [user, defaultAddress]);



  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setSubmitting(true);

    setSubmitError("");



    const summary = items

      .map((i) => localized(i.name, locale))

      .join(", ");



    try {

      const order = await submitOrderToApi({

        customerName: form.name.trim(),

        customerPhone: form.phone.trim(),

        city: form.city.trim(),

        address: form.address.trim(),

        comment: form.comment.trim(),

        deliveryType,

        promoCode,

        items,

        token,

      });

      addOrder(order);

      setOrderNumber(order.number);

      setSubmitted(true);

      clear();

      if (token) {

        void syncFromApi(token);

      }

    } catch {

      const num = generateLocalOrderNumber();

      addOrder({

        id: num,

        number: num,

        status: "new",

        total: total(),

        createdAt: new Date().toISOString(),

        customerName: form.name,

        itemsSummary: summary,

      });

      setOrderNumber(num);

      setSubmitted(true);

      clear();

    } finally {

      setSubmitting(false);

    }

  };



  if (submitted) {

    return (

      <Page>

        <div className="text-center py-12">

          <div className="mx-auto w-12 h-12 bg-[var(--color-accent)] rounded-full flex items-center justify-center mb-4">

            <Check className="text-white" size={24} />

          </div>

          <h1 className="page-title">{t("success")}</h1>

          <p className="text-xs text-[var(--color-muted)] mt-2">{t("orderNumber")}</p>

          <p className="text-sm font-semibold mt-1 tabular-nums">{orderNumber}</p>

          <Link href={`/${locale}/catalog`} className="btn btn-primary mt-6 inline-flex">

            {t("backToCatalog")}

          </Link>

        </div>

      </Page>

    );

  }



  if (items.length === 0) {

    return (

      <Page>

        <p className="text-sm text-[var(--color-muted)] text-center py-12">{t("emptyCart")}</p>

        <Link href={`/${locale}/catalog`} className="btn btn-primary w-full">

          {t("backToCatalog")}

        </Link>

      </Page>

    );

  }



  return (

    <Page>

      <PageHeader title={t("title")} subtitle={formatPrice(total())} />



      <form onSubmit={handleSubmit} className="card p-4 space-y-3">

        {(["name", "phone", "city", "address"] as const).map((field) => (

          <div key={field}>

            <label className="text-[10px] text-[var(--color-muted)] block mb-1">{t(field)}</label>

            <input

              required={field !== "address" || deliveryType === "delivery"}

              value={form[field]}

              onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}

              className="input"

              disabled={submitting}

            />

          </div>

        ))}

        <div>

          <label className="text-[10px] text-[var(--color-muted)] block mb-1">{t("comment")}</label>

          <textarea

            value={form.comment}

            onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}

            rows={2}

            className="input !h-auto py-2 resize-none"

            disabled={submitting}

          />

        </div>

        <div className="flex gap-2">

          {(["pickup", "delivery"] as const).map((type) => (

            <button

              key={type}

              type="button"

              onClick={() => setDeliveryType(type)}

              className={cn("chip flex-1", deliveryType === type && "chip-active")}

              disabled={submitting}

            >

              {t(type)}

            </button>

          ))}

        </div>

        {submitError && (

          <p className="text-xs text-red-500 text-center">{submitError}</p>

        )}

        <button type="submit" className="btn btn-primary w-full" disabled={submitting}>

          {submitting ? (

            <span className="inline-flex items-center gap-2">

              <Loader2 size={16} className="animate-spin" />

              {t("submitting")}

            </span>

          ) : (

            t("submit")

          )}

        </button>

      </form>

    </Page>

  );

}

