import { NextResponse } from "next/server";
import { normalizePhone, isValidPhone } from "@/lib/phone";
import {
  createToken,
  getUsers,
  saveUsers,
} from "@/lib/server/data-store";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      phone?: string;
      password?: string;
    };

    const name = body.name?.trim() ?? "";
    const phone = normalizePhone(body.phone ?? "");
    const password = body.password?.trim() ?? "";

    if (!name) {
      return NextResponse.json({ message: "Введите имя" }, { status: 422 });
    }
    if (!isValidPhone(body.phone ?? "")) {
      return NextResponse.json(
        { message: "Введите корректный номер телефона" },
        { status: 422 }
      );
    }
    if (password.length < 4) {
      return NextResponse.json(
        { message: "Пароль минимум 4 символа" },
        { status: 422 }
      );
    }

    const users = await getUsers();
    if (users.some((u) => u.phone === phone)) {
      return NextResponse.json(
        { message: "Этот номер уже зарегистрирован" },
        { status: 422 }
      );
    }

    const user = {
      id: randomUUID(),
      phone,
      password,
      name,
    };
    users.push(user);
    await saveUsers(users);

    const access_token = await createToken(user.id);

    return NextResponse.json(
      {
        access_token,
        token_type: "bearer",
        user: { id: user.id, name: user.name, phone: user.phone },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ message: "Ошибка регистрации" }, { status: 500 });
  }
}
