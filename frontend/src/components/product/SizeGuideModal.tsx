"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler } from "lucide-react";

export function SizeGuideModal({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (size: string) => void;
}) {
  const t = useTranslations("product");
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);
  const [age, setAge] = useState(28);

  const suggested = () => {
    const bmi = weight / ((height / 100) ** 2);
    if (age < 18) return bmi < 22 ? "S" : "M";
    if (bmi < 20) return "S";
    if (bmi < 24) return "M";
    if (bmi < 28) return "L";
    return "XL";
  };

  const size = suggested();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95] flex items-center justify-center bg-black/60 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Ruler size={20} />
                <h3 className="text-sm uppercase tracking-[0.2em] font-bold">
                  {t("sizeGuide")}
                </h3>
              </div>
              <button type="button" onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="text-[10px] uppercase tracking-widest text-black/50">
                  {t("height")} (см)
                </span>
                <input
                  type="range"
                  min={150}
                  max={210}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full mt-2 accent-black"
                />
                <span className="text-sm font-medium">{height}</span>
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-widest text-black/50">
                  {t("weight")} (кг)
                </span>
                <input
                  type="range"
                  min={45}
                  max={120}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full mt-2 accent-black"
                />
                <span className="text-sm font-medium">{weight}</span>
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-widest text-black/50">
                  {t("age")}
                </span>
                <input
                  type="range"
                  min={16}
                  max={60}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full mt-2 accent-black"
                />
                <span className="text-sm font-medium">{age}</span>
              </label>
            </div>

            <div className="mt-8 p-4 bg-black text-white text-center">
              <p className="text-[10px] uppercase tracking-widest text-white/50">
                {t("recommended")}
              </p>
              <p className="font-display text-5xl font-bold mt-1">{size}</p>
            </div>

            <button
              type="button"
              onClick={() => {
                onSelect(size);
                onClose();
              }}
              className="mt-6 w-full bg-[#00A531] text-white py-4 text-xs uppercase tracking-[0.25em]"
            >
              {t("applySize", { size })}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
