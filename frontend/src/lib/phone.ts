export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("992")) return `+${digits}`;
  if (digits.length === 9) return `+992${digits}`;
  return `+${digits}`;
}

export function formatPhoneDisplay(phone: string): string {
  const n = normalizePhone(phone);
  if (n.length < 12) return phone;
  return `${n.slice(0, 4)} ${n.slice(4, 6)} ${n.slice(6, 9)} ${n.slice(9, 11)} ${n.slice(11)}`;
}

export function isValidPhone(input: string): boolean {
  const digits = input.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 12;
}
