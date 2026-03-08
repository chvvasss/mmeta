import { format, formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"

const currencyFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const compactCurrencyFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})

const numberFormatter = new Intl.NumberFormat("tr-TR")

const compactNumberFormatter = new Intl.NumberFormat("tr-TR", {
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})

const percentFormatter = new Intl.NumberFormat("tr-TR", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount)
}

export function formatCurrencyCompact(amount: number): string {
  return compactCurrencyFormatter.format(amount)
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

export function formatNumberCompact(value: number): string {
  return compactNumberFormatter.format(value)
}

export function formatPercent(value: number): string {
  return percentFormatter.format(value / 100)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return format(d, "dd.MM.yyyy", { locale: tr })
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return format(d, "dd.MM.yyyy HH:mm", { locale: tr })
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return formatDistanceToNow(d, { addSuffix: true, locale: tr })
}

export function centsToLira(cents: number): number {
  return cents / 100
}

export function liraToCents(lira: number): number {
  return Math.round(lira * 100)
}
