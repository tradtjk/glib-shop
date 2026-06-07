"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { api, mapApiOrder, type ApiOrder } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

const statusLabels: Record<string, string> = {
  new: "Новый",
  confirmed: "Подтверждён",
  processing: "Собирается",
  shipped: "Отправлен",
  delivered: "Доставлен",
  cancelled: "Отменён",
};

export function AdminOrdersPanel() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const res = await api.orders.listAll();
        if (active) setOrders(res.data);
      } catch {
        if (active) setOrders([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    const timer = window.setInterval(load, 15_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 size={28} className="animate-spin text-white/40" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <p className="text-sm text-white/50 py-8 text-center">
        Заказов пока нет. Оформите заказ на витрине — он появится здесь автоматически.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((raw) => {
        const order = mapApiOrder(raw);
        return (
          <div
            key={order.id}
            className="p-4 rounded-xl border border-white/10 bg-white/[0.03] flex justify-between gap-4"
          >
            <div className="min-w-0">
              <p className="font-semibold tabular-nums">{order.number}</p>
              <p className="text-xs text-white/50 mt-1">
                {order.customerName} · {new Date(order.createdAt).toLocaleString()}
              </p>
              <p className="text-xs text-white/40 mt-2 line-clamp-2">{order.itemsSummary}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-semibold tabular-nums">{formatPrice(order.total)}</p>
              <p className="text-xs text-white/50 mt-1">
                {statusLabels[order.status] ?? order.status}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
