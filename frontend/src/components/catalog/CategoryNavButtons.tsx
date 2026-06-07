"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryNavButtonsProps {
  canLeft: boolean;
  canRight: boolean;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}

export function CategoryNavButtons({
  canLeft,
  canRight,
  onPrev,
  onNext,
  className,
}: CategoryNavButtonsProps) {
  return (
    <div className={cn("flex gap-2 shrink-0", className)}>
      <button
        type="button"
        className="category-nav-btn"
        onClick={onPrev}
        disabled={!canLeft}
        aria-label="Предыдущие категории"
      >
        <ChevronLeft size={20} strokeWidth={2.25} />
      </button>
      <button
        type="button"
        className="category-nav-btn"
        onClick={onNext}
        disabled={!canRight}
        aria-label="Следующие категории"
      >
        <ChevronRight size={20} strokeWidth={2.25} />
      </button>
    </div>
  );
}
