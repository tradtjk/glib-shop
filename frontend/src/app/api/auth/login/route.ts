import { NextResponse } from "next/server";
import { normalizePhone } from "@/lib/phone";
import { createToken, getUsers } from "@/lib/server/data-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      phone?: string;
      password?: string;
    };

    const phone = normalizePhone(body.phone ?? "");
    const password = body.password?.trim() ?? "";

    const users = await getUsers();
    const user = users.find((u) => u.phone === phone && u.password === password);

    if (!user) {
      return NextResponse.json(
        { message: "Неверный номер или пароль" },
        { status: 401 }
      );
    }

    const access_token = await createToken(user.id);

    return NextResponse.json({
      access_token,
      token_type: "bearer",
      user: { id: user.id, name: user.name, phone: user.phone },
    });
  } catch {
    return NextResponse.json({ message: "Ошибка входа" }, { status: 500 });
  }
}
