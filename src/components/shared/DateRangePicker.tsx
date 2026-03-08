"use client"

import { useDateRangeStore } from "@/stores/date-range-store"
import { DATE_PRESETS, type DatePreset } from "@/lib/constants"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar as CalendarIcon } from "lucide-react"
import { formatDate } from "@/lib/formatting"

export function DateRangePicker() {
  const { from, to, preset, setPreset } = useDateRangeStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex h-8 items-center gap-2 rounded-lg border border-[rgba(148,163,184,0.08)] bg-[#0c1220]/60 px-3 text-xs text-slate-400 hover:text-slate-200 hover:border-blue-500/20 transition-all duration-200"
      >
        <CalendarIcon className="h-3 w-3 text-blue-400" />
        <span className="font-medium">
          {DATE_PRESETS[preset]}
        </span>
        <span className="hidden sm:inline text-slate-600">
          {formatDate(from)} — {formatDate(to)}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="border-[rgba(148,163,184,0.08)] bg-[#0c1220]"
      >
        {(Object.entries(DATE_PRESETS) as [DatePreset, string][]).map(
          ([key, label]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => setPreset(key)}
              className={`text-xs ${
                preset === key
                  ? "bg-blue-500/10 text-blue-400"
                  : "text-slate-400 focus:bg-slate-800 focus:text-white"
              }`}
            >
              {label}
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
