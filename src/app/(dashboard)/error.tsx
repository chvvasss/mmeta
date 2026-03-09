"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[Dashboard Error]", error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="glass-card max-w-md rounded-xl p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
          <AlertTriangle className="h-6 w-6 text-red-400" />
        </div>
        <h2 className="mb-2 text-lg font-semibold text-white">Bir Hata Olustu</h2>
        <p className="mb-6 text-sm text-slate-400">
          {error.message || "Beklenmeyen bir hata meydana geldi. Lutfen tekrar deneyin."}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-400 border border-blue-500/20 transition-all hover:bg-blue-500/30 hover:border-blue-500/40"
        >
          <RefreshCw className="h-4 w-4" />
          Tekrar Dene
        </button>
      </div>
    </div>
  )
}
