"use client"

import { AlertTriangle, AlertCircle, Info, Clock, ChevronRight } from "lucide-react"
import { formatRelativeTime } from "@/lib/formatting"
import { ALERT_TYPES } from "@/lib/constants"
import type { AlertItem } from "@/types/app"
import Link from "next/link"

interface AlertsFeedProps {
  alerts: AlertItem[]
  loading?: boolean
}

function AlertIcon({ severity }: { severity: AlertItem["severity"] }) {
  switch (severity) {
    case "critical":
      return <AlertTriangle className="h-4 w-4 text-red-400" />
    case "warning":
      return <AlertCircle className="h-4 w-4 text-amber-400" />
    default:
      return <Info className="h-4 w-4 text-blue-400" />
  }
}

export function AlertsFeed({ alerts, loading }: AlertsFeedProps) {
  if (loading) {
    return (
      <div className="glass-card rounded-xl p-5 opacity-0 animate-slide-up" style={{ animationDelay: "480ms", animationFillMode: "forwards" }}>
        <div className="skeleton-loader h-5 w-20 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton-loader h-16 w-full rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  const unread = alerts.filter((a) => !a.isRead)
  const read = alerts.filter((a) => a.isRead)

  return (
    <div
      className="glass-card rounded-xl p-5 opacity-0 animate-slide-up"
      style={{ animationDelay: "480ms", animationFillMode: "forwards" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Uyarılar
          </h3>
          {unread.length > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500/20 px-1.5 text-[10px] font-bold text-red-400">
              {unread.length}
            </span>
          )}
        </div>
        <Link href="/alerts" className="text-[11px] font-medium text-blue-400 hover:text-blue-300 transition-colors">
          Tümü
        </Link>
      </div>

      <div className="space-y-2">
        {[...unread, ...read].slice(0, 5).map((alert, i) => (
          <div
            key={alert.id}
            className={`group rounded-lg p-3 transition-all duration-200 cursor-pointer hover:bg-slate-800/30 ${
              alert.severity === "critical"
                ? "alert-critical"
                : alert.severity === "warning"
                ? "alert-warning"
                : "alert-info"
            } ${!alert.isRead ? "" : "opacity-60"}`}
            style={{
              animationDelay: `${480 + i * 60}ms`,
            }}
          >
            <div className="flex gap-3">
              <div className="mt-0.5 flex-shrink-0">
                <AlertIcon severity={alert.severity} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-white line-clamp-1">
                    {alert.title}
                  </p>
                  {!alert.isRead && (
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                  )}
                </div>
                <p className="mt-0.5 text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {alert.message}
                </p>
                <div className="mt-1.5 flex items-center gap-3">
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Clock className="h-3 w-3" />
                    {formatRelativeTime(alert.createdAt)}
                  </div>
                  <span className="text-[10px] text-slate-600">
                    {ALERT_TYPES[alert.type as keyof typeof ALERT_TYPES] || alert.type}
                  </span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
            </div>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="py-8 text-center">
            <Info className="mx-auto h-8 w-8 text-slate-700" />
            <p className="mt-2 text-xs text-slate-500">Uyarı bulunmuyor</p>
          </div>
        )}
      </div>
    </div>
  )
}
