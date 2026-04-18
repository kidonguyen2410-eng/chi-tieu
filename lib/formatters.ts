// Format VND currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Compact format for large numbers
export function formatCurrencyCompact(amount: number): string {
  if (Math.abs(amount) >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)} tỷ`;
  }
  if (Math.abs(amount) >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)} tr`;
  }
  return formatCurrency(amount);
}

// Format date for display
export function formatDate(date: string | Date, format: "short" | "long" | "time" | "datetime" = "short"): string {
  const d = new Date(date);
  const formats: Record<string, Intl.DateTimeFormatOptions> = {
    short: { day: "2-digit", month: "2-digit", year: "numeric" },
    long: { weekday: "long", day: "2-digit", month: "long", year: "numeric" },
    time: { hour: "2-digit", minute: "2-digit" },
    datetime: { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" },
  };
  return d.toLocaleDateString("vi-VN", formats[format]);
}

export function formatDateHeader(date: string | Date): string {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(d, today)) return "Hôm nay";
  if (isSameDay(d, yesterday)) return "Hôm qua";
  return d.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit" });
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}
