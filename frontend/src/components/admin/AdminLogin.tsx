"use client";

import { useState } from "react";
import { useAdminAuthStore } from "@/stores/admin-auth-store";

export function AdminLogin() {
  const login = useAdminAuthStore((s) => s.login);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const ok = login(username, password);
    if (!ok) {
      setError("Неверный логин или пароль (admin / 123)");
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm form-card !bg-white/5 !border-white/10">
        <p className="text-xs font-medium text-[#00A531] mb-1 text-center">Golib Shop</p>
        <h1 className="text-xl font-semibold text-center mb-6 text-white">Админ-панель</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-300 bg-red-950/60 border border-red-800/50 rounded-lg px-3 py-2 text-center">
              {error}
            </p>
          )}
          <div>
            <label className="input-label !text-white/60">Логин</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input !bg-white/10 !border-white/15 !text-white"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="input-label !text-white/60">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input !bg-white/10 !border-white/15 !text-white"
              autoComplete="current-password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn w-full !min-h-[3rem] bg-[#00A531] text-white border-0 hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-white/40">Логин: admin · Пароль: 123</p>
      </div>
    </div>
  );
}
