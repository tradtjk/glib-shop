function getCategoryItems(el: HTMLDivElement) {
  return Array.from(el.querySelectorAll<HTMLElement>("[data-category-item]"));
}

function getItemStep(el: HTMLDivElement) {
  const items = getCategoryItems(el);
  if (!items.length) return 88;
  const gap = 10;
  return items[0].offsetWidth + gap;
}

function itemOffset(el: HTMLDivElement, item: HTMLElement) {
  const left = item.offsetLeft;
  if (left > 0 || el.scrollLeft === 0) return left;
  const containerRect = el.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();
  return itemRect.left - containerRect.left + el.scrollLeft;
}

export function hasCategoryOverflow(el: HTMLDivElement) {
  const items = getCategoryItems(el);
  if (items.length < 2) return false;
  const total = getItemStep(el) * items.length;
  return total > el.clientWidth + 4 || el.scrollWidth > el.clientWidth + 4;
}

export function scrollCategoryRow(el: HTMLDivElement, dir: -1 | 1) {
  const items = getCategoryItems(el);
  if (!items.length) return;

  const scrollLeft = el.scrollLeft;
  const edge = 8;
  const step = getItemStep(el);

  if (dir === 1) {
    const next = items.find((item) => itemOffset(el, item) > scrollLeft + edge);
    if (next) {
      el.scrollTo({
        left: Math.max(0, itemOffset(el, next) - edge),
        behavior: "smooth",
      });
      return;
    }
    el.scrollBy({ left: step, behavior: "smooth" });
    return;
  }

  const prev = [...items]
    .reverse()
    .find((item) => itemOffset(el, item) < scrollLeft - edge);
  if (prev) {
    el.scrollTo({
      left: Math.max(0, itemOffset(el, prev) - edge),
      behavior: "smooth",
    });
    return;
  }
  el.scrollBy({ left: -step, behavior: "smooth" });
}

export function categoryRowScrollState(el: HTMLDivElement) {
  const items = getCategoryItems(el);
  if (!items.length) {
    return { canLeft: false, canRight: false };
  }

  const step = getItemStep(el);
  const totalWidth = step * items.length;
  const maxScroll = Math.max(
    0,
    el.scrollWidth - el.clientWidth,
    totalWidth - el.clientWidth
  );

  const canRight =
    maxScroll > 4 &&
    (el.scrollLeft < maxScroll - 4 ||
      (items.length > 4 && el.scrollLeft + el.clientWidth < totalWidth - 8));

  return {
    canLeft: el.scrollLeft > 4,
    canRight,
  };
}
