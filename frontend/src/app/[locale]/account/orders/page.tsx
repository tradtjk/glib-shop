"use client";



import { useTranslations } from "next-intl";

import { Loader2 } from "lucide-react";

import { useOrdersStore } from "@/stores/orders-store";

import { useOrdersSync } from "@/hooks/use-orders-sync";

import { formatPrice } from "@/lib/utils";

import { AccountPageHeader } from "@/components/account/AccountPageHeader";



const statusLabels: Record<string, string> = {

  new: "Новый",

  pending: "Новый",

  confirmed: "Подтверждён",

  processing: "Собирается",

  shipped: "Отправлен",

  delivered: "Доставлен",

  cancelled: "Отменён",

};



export default function OrdersPage() {

  const t = useTranslations("account");

  const orders = useOrdersStore((s) => s.orders);

  const syncing = useOrdersStore((s) => s.syncing);

  useOrdersSync(true);



  return (

    <div>

      <AccountPageHeader

        title={t("orders")}

        subtitle={syncing ? t("ordersSyncing") : undefined}

      />

      {syncing && orders.length === 0 ? (

        <div className="flex justify-center py-12">

          <Loader2 size={24} className="animate-spin text-[var(--color-muted)]" />

        </div>

      ) : orders.length === 0 ? (

        <p className="text-sm text-[var(--color-muted)] py-8 text-center">{t("noOrders")}</p>

      ) : (

        <div className="space-y-2">

          {orders.map((order) => (

            <div key={order.id} className="card p-3 flex justify-between gap-3">

              <div className="min-w-0">

                <p className="text-xs font-semibold tabular-nums">{order.number}</p>

                <p className="text-[10px] text-[var(--color-muted)] mt-0.5">

                  {new Date(order.createdAt).toLocaleDateString()}

                </p>

                <p className="text-[10px] text-[var(--color-muted)] mt-1 line-clamp-2">

                  {order.itemsSummary}

                </p>

              </div>

              <div className="text-right shrink-0">

                <p className="text-xs font-semibold tabular-nums">{formatPrice(order.total)}</p>

                <p className="text-[10px] text-[var(--color-muted)] mt-0.5">

                  {statusLabels[order.status] ?? order.status}

                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}

