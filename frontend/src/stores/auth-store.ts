"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { normalizePhone, isValidPhone } from "@/lib/phone";
import { api, ApiError } from "@/lib/api";
import { useOrdersStore } from "@/stores/orders-store";

export interface User {
  id: string;
  phone: string;
  name: string;
  password: string;
}

function newId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function loadUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("golib-users");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<User & { email?: string }>;
    return parsed.map((u) => ({
      id: u.id,
      phone: normalizePhone(u.phone || u.email || ""),
      name: u.name || "",
      password: u.password || "",
    }));
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem("golib-users", JSON.stringify(users));
}

interface AuthState {
  user: User | null;
  token: string | null;
  register: (data: {
    phone: string;
    password: string;
    name: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  login: (phone: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<Pick<User, "name">>) => void;
}

function userWithoutPassword(user: User): User {
  return { ...user };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      register: async (data) => {
        if (typeof window === "undefined") {
          return { ok: false, error: "Подождите загрузку страницы" };
        }

        const phone = normalizePhone(data.phone);
        const password = data.password.trim();
        const name = data.name.trim();

        if (!name) return { ok: false, error: "Введите имя" };
        if (!isValidPhone(data.phone)) {
          return { ok: false, error: "Введите корректный номер телефона" };
        }
        if (password.length < 4) {
          return { ok: false, error: "Пароль минимум 4 символа" };
        }

        try {
          const res = await api.auth.register({ name, phone, password });
          const user: User = {
            id: res.user.id,
            phone: res.user.phone,
            name: res.user.name,
            password,
          };
          set({ user: userWithoutPassword(user), token: res.access_token });
          void useOrdersStore.getState().syncFromApi(res.access_token);
          return { ok: true };
        } catch (err) {
          if (err instanceof ApiError && err.status !== 0 && err.status < 500) {
            return { ok: false, error: err.message };
          }
        }

        const users = loadUsers();
        if (users.some((u) => u.phone === phone)) {
          return { ok: false, error: "Этот номер уже зарегистрирован" };
        }

        const user: User = { id: newId(), phone, password, name };
        users.push(user);
        saveUsers(users);
        set({ user: userWithoutPassword(user), token: null });
        return { ok: true };
      },
      login: async (phoneInput, password) => {
        if (typeof window === "undefined") {
          return { ok: false, error: "Подождите загрузку страницы" };
        }

        const phone = normalizePhone(phoneInput);
        const p = password.trim();

        try {
          const res = await api.auth.login(phone, p);
          const user: User = {
            id: res.user.id,
            phone: res.user.phone,
            name: res.user.name,
            password: p,
          };
          set({ user: userWithoutPassword(user), token: res.access_token });
          void useOrdersStore.getState().syncFromApi(res.access_token);
          return { ok: true };
        } catch (err) {
          if (err instanceof ApiError && err.status === 401) {
            return { ok: false, error: err.message || "Неверный номер или пароль" };
          }
          if (err instanceof ApiError && err.status !== 0 && err.status < 500) {
            return { ok: false, error: err.message };
          }
        }

        const users = loadUsers();
        const found = users.find((u) => u.phone === phone && u.password === p);
        if (!found) {
          return { ok: false, error: "Неверный номер или пароль" };
        }
        set({ user: userWithoutPassword(found), token: null });
        return { ok: true };
      },
      logout: () => set({ user: null, token: null }),
      updateProfile: (data) => {
        const user = get().user;
        if (!user) return;
        const updated = {
          ...user,
          name: data.name?.trim() ?? user.name,
        };
        set({ user: updated });
        const users = loadUsers();
        const idx = users.findIndex((u) => u.id === user.id);
        if (idx >= 0) {
          users[idx] = { ...users[idx], name: updated.name };
          saveUsers(users);
        }
      },
    }),
    {
      name: "golib-auth",
      partialize: (s) => ({ user: s.user, token: s.token }),
    }
  )
);
