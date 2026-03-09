"use client"

import { Plus, FileText, Zap, BarChart3, Target, Download } from "lucide-react"
import Link from "next/link"

const actions = [
  { label: "Kampanya Olustur", icon: Plus, href: "/campaigns/create", color: "from-blue-500/20 to-blue-600/20 border-blue-500/20 text-blue-400 hover:border-blue-500/40" },
  { label: "Rapor Al", icon: FileText, href: "/reports", color: "from-emerald-500/20 to-emerald-600/20 border-emerald-500/20 text-emerald-400 hover:border-emerald-500/40" },
  { label: "Otomasyon Kur", icon: Zap, href: "/automation/create", color: "from-amber-500/20 to-amber-600/20 border-amber-500/20 text-amber-400 hover:border-amber-500/40" },
  { label: "Analitik", icon: BarChart3, href: "/analytics", color: "from-cyan-500/20 to-cyan-600/20 border-cyan-500/20 text-cyan-400 hover:border-cyan-500/40" },
  { label: "Kitle Olustur", icon: Target, href: "/audiences/create", color: "from-purple-500/20 to-purple-600/20 border-purple-500/20 text-purple-400 hover:border-purple-500/40" },
  { label: "CSV Export", icon: Download, href: "/api/reports/export?format=csv", color: "from-slate-500/20 to-slate-600/20 border-slate-500/20 text-slate-400 hover:border-slate-500/40" },
]

export function QuickActions() {
  return (
    <div className="glass-card rounded-xl p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Hizli Islemler
      </h3>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={`flex flex-col items-center gap-1.5 rounded-lg border bg-gradient-to-br p-3 transition-all duration-200 hover:scale-[1.02] ${action.color}`}
          >
            <action.icon className="h-4 w-4" />
            <span className="text-[10px] font-medium text-center leading-tight">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
