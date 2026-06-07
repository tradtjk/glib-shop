import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { normalizePhone } from "@/lib/phone";
import {
  formatOrderResponse,
  generateOrderNumber,
  getOrders,
  resolveUserId,
  saveOrders,
  type ServerOrder,
  type ServerOrderItem,
} from "@/lib/server/data-store";

function bearerToken(request: Request): string | null {
  const header = request.headers.get("Authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice(7).trim() || null;
}

interface OrderItemInput {
  product_id?: number;
  product_slug?: string;
  product_name?: string;
  size?: string;
  color?: string;
  quantity?: number;
  price?: number;
}

interface CreateOrderBody {
  customer_name?: string;
  customer_phone?: string;
  city?: string;
  address?: string;
  comment?: string;
  delivery_type?: "pickup" | "delivery";
  promo_code?: string;
  items?: OrderItemInput[];
}

export async function GET(request: Request) {
  const token = bearerToken(request);
  const userId = await resolveUserId(token);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const orders = await getOrders();
  const userOrders = orders
    .filter((o) => o.userId === userId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .map(formatOrderResponse);

  return NextResponse.json({ data: userOrders });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateOrderBody;
    const token = bearerToken(request);
    const userId = await resolveUserId(token);

    const customerName = body.customer_name?.trim();
    const customerPhone = normalizePhone(body.customer_phone ?? "");
    const deliveryType = body.delivery_type ?? "delivery";
    const items = body.items ?? [];

    if (!customerName) {
      return NextResponse.json({ message: "Укажите имя" }, { status: 422 });
    }
    if (!customerPhone) {
      return NextResponse.json({ message: "Укажите телефон" }, { status: 422 });
    }
    if (!["pickup", "delivery"].includes(deliveryType)) {
      return NextResponse.json(
        { message: "Неверный тип доставки" },
        { status: 422 }
      );
    }
    if (items.length === 0) {
      return NextResponse.json({ message: "Корзина пуста" }, { status: 422 });
    }

    const orderItems: ServerOrderItem[] = items.map((item) => {
      const quantity = Math.max(1, item.quantity ?? 1);
      const price = item.price ?? 0;
      return {
        productSlug: item.product_slug,
        productName:
          item.product_name?.trim() ||
          item.product_slug ||
          `Товар #${item.product_id ?? "?"}`,
        size: item.size,
        color: item.color,
        quantity,
        price,
      };
    });

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order: ServerOrder = {
      id: randomUUID(),
      number: generateOrderNumber(),
      userId,
      status: "new",
      total: subtotal,
      subtotal,
      customerName,
      customerPhone,
      city: body.city?.trim() || undefined,
      address: body.address?.trim() || undefined,
      comment: body.comment?.trim() || undefined,
      deliveryType,
      promoCode: body.promo_code?.trim() || undefined,
      items: orderItems,
      createdAt: new Date().toISOString(),
    };

    const orders = await getOrders();
    orders.unshift(order);
    await saveOrders(orders);

    return NextResponse.json(
      {
        data: {
          id: order.id,
          number: order.number,
          total: order.total,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ message: "Ошибка создания заказа" }, { status: 500 });
  }
}
