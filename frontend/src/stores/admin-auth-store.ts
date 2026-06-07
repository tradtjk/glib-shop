"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const ADMIN_USER = "admin";
const ADMIN_PASS = "123";

interface AdminAuthState {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: (username, password) => {
        const u = username.trim().toLowerCase();
        const p = password.trim();
        if (u === ADMIN_USER && p === ADMIN_PASS) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: "golib-admin-auth",
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
    }
  )
);
