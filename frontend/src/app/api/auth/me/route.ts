import { NextResponse } from "next/server";
import { getUsers, resolveUserId } from "@/lib/server/data-store";

function bearerToken(request: Request): string | null {
  const header = request.headers.get("Authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice(7).trim() || null;
}

export async function GET(request: Request) {
  const token = bearerToken(request);
  const userId = await resolveUserId(token);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const users = await getUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    data: { id: user.id, name: user.name, phone: user.phone },
  });
}
