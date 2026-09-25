export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
