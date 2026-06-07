"use client";

import { useAdminAuthStore } from "@/stores/admin-auth-store";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { useHydrated } from "@/hooks/use-hydrated";

export default function AdminPage() {
  const hydrated = useHydrated();
  const isAuthenticated = useAdminAuthStore((s) => s.isAuthenticated);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/50 text-sm">
        Загрузка...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
}
