import { create } from "zustand"
import { subDays, startOfDay, endOfDay } from "date-fns"
import type { DatePreset } from "@/lib/constants"

interface DateRangeStore {
  from: Date
  to: Date
  preset: DatePreset
  setPreset: (preset: DatePreset) => void
  setCustomRange: (from: Date, to: Date) => void
}

function getPresetDates(preset: DatePreset): { from: Date; to: Date } {
  const now = new Date()
  const today = startOfDay(now)
  const endToday = endOfDay(now)

  switch (preset) {
    case "today":
      return { from: today, to: endToday }
    case "yesterday":
      return { from: subDays(today, 1), to: startOfDay(today) }
    case "last_7d":
      return { from: subDays(today, 7), to: endToday }
    case "last_14d":
      return { from: subDays(today, 14), to: endToday }
    case "last_30d":
      return { from: subDays(today, 30), to: endToday }
    case "last_90d":
      return { from: subDays(today, 90), to: endToday }
    case "this_month":
      return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: endToday }
    case "last_month": {
      const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
      return { from: firstDayLastMonth, to: endOfDay(lastDayLastMonth) }
    }
    default:
      return { from: subDays(today, 7), to: endToday }
  }
}

const defaultDates = getPresetDates("last_7d")

export const useDateRangeStore = create<DateRangeStore>()((set) => ({
  from: defaultDates.from,
  to: defaultDates.to,
  preset: "last_7d",
  setPreset: (preset) => {
    const dates = getPresetDates(preset)
    set({ preset, ...dates })
  },
  setCustomRange: (from, to) => set({ from, to, preset: "last_7d" }),
}))
