export type ShareResult = "shared" | "copied" | "cancelled" | "failed";

export async function shareProductLink({
  title,
  url,
  text,
}: {
  title: string;
  url: string;
  text?: string;
}): Promise<ShareResult> {
  const payload = {
    title,
    text: text ?? title,
    url,
  };

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share(payload);
      return "shared";
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return "cancelled";
      }
    }
  }

  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return "copied";
    }

    const textarea = document.createElement("textarea");
    textarea.value = url;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok ? "copied" : "failed";
  } catch {
    return "failed";
  }
}
