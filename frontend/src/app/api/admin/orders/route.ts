import { NextResponse } from "next/server";
import { formatOrderResponse, getOrders } from "@/lib/server/data-store";

export async function GET() {
  const orders = await getOrders();
  const sorted = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json({ data: sorted.map(formatOrderResponse) });
}
