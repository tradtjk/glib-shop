"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

export function AuthSuccessOverlay({
  mode,
}: {
  mode: "login" | "register";
}) {
  const t = useTranslations("account");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--color-surface)] px-6"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 14, stiffness: 200, delay: 0.05 }}
        className="text-center max-w-xs"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 260, delay: 0.15 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-brand)] text-white shadow-lg shadow-[var(--color-brand)]/30"
        >
          <Check size={40} strokeWidth={2.5} />
        </motion.div>
        <motion.h2
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-xl font-semibold"
        >
          {mode === "register" ? t("successRegister") : t("successLogin")}
        </motion.h2>
        <motion.p
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-2 text-sm text-[var(--color-muted)]"
        >
          {t("successRedirect")}
        </motion.p>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
          className="mt-8 h-1 rounded-full bg-[var(--color-brand)]/20 overflow-hidden mx-auto max-w-[200px]"
        >
          <div className="h-full bg-[var(--color-brand)] rounded-full w-full origin-left" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
