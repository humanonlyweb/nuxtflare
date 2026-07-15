// Currency
const cad = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});

export function money(value: number): string {
  return Number.isFinite(value) ? cad.format(value) : "$0";
}

const cadFr = new Intl.NumberFormat("fr-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});

export function moneyFr(value: number): string {
  return Number.isFinite(value) ? cadFr.format(value) : "0 $";
}

// Dates
const shortDateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function shortDate(date: Date | number): string {
  return shortDateFmt.format(date);
}

const shortDateFrFmt = new Intl.DateTimeFormat("fr-CA", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

export function shortDateFr(date: Date | number): string {
  return shortDateFrFmt.format(date);
}

// Media
export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${Math.round(bytes / (1024 * 1024))} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} bytes`;
}
