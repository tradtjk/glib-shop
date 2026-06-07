import type { MobileTabId } from "@/lib/mobile-tabs";

function resetElementScroll(el: HTMLElement | null | undefined) {
  if (!el) return;
  el.scrollTop = 0;
  el.scrollLeft = 0;
}

function resetWindowScroll() {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

export function scrollAppToTop(opts?: { tab?: MobileTabId }) {
  if (typeof document === "undefined") return;

  resetWindowScroll();

  document.querySelectorAll<HTMLElement>(".mobile-tab-panel").forEach(resetElementScroll);
  document.querySelectorAll<HTMLElement>(".route-cache-panel").forEach(resetElementScroll);
  document.querySelectorAll<HTMLElement>(".account-sub-panel").forEach(resetElementScroll);

  if (opts?.tab) {
    resetElementScroll(document.getElementById(`mobile-tab-${opts.tab}`));
  }

  const visibleTab = document.querySelector<HTMLElement>(
    ".mobile-tab-panel:not(.hidden)"
  );
  resetElementScroll(visibleTab);

  const visibleRoute = document.querySelector<HTMLElement>(
    ".route-cache-panel:not(.hidden)"
  );
  resetElementScroll(visibleRoute);

  const visibleAccount = document.querySelector<HTMLElement>(
    ".account-sub-panel:not(.hidden)"
  );
  resetElementScroll(visibleAccount);
}

export function scrollAppToTopSoon(opts?: { tab?: MobileTabId }) {
  scrollAppToTop(opts);
  requestAnimationFrame(() => {
    scrollAppToTop(opts);
    requestAnimationFrame(() => scrollAppToTop(opts));
  });
  window.setTimeout(() => scrollAppToTop(opts), 0);
  window.setTimeout(() => scrollAppToTop(opts), 50);
  window.setTimeout(() => scrollAppToTop(opts), 150);
}
