"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { NAV_ITEMS } from "@/lib/constants"
import {
  LayoutDashboard,
  Megaphone,
  Layers,
  Image,
  Users,
  Activity,
  BarChart3,
  Zap,
  Search,
  FileText,
  Building2,
  Settings,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { AccountSwitcher } from "./AccountSwitcher"

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Megaphone,
  Layers,
  Image,
  Users,
  Activity,
  BarChart3,
  Zap,
  Search,
  FileText,
  Building2,
  Settings,
}

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r transition-all duration-300",
        "bg-[#080d18] border-[rgba(148,163,184,0.06)]",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-[rgba(148,163,184,0.06)] px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20">
          <Megaphone className="h-4 w-4 text-white" />
        </div>
        {!collapsed && (
          <div className="ml-3 overflow-hidden">
            <span className="text-sm font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              Meta Ads
            </span>
            <span className="ml-1 text-[10px] font-medium text-blue-400 uppercase tracking-widest">CC</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon]
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200 relative",
                isActive
                  ? "bg-blue-500/10 text-blue-400"
                  : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-200"
              )}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-r bg-blue-400" />
              )}
              {Icon && (
                <Icon className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive ? "text-blue-400" : "text-slate-600 group-hover:text-slate-400"
                )} />
              )}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Account Switcher */}
      {!collapsed && (
        <div className="border-t border-[rgba(148,163,184,0.06)] p-3">
          <AccountSwitcher />
        </div>
      )}

      {/* Collapse Toggle */}
      <div className="border-t border-[rgba(148,163,184,0.06)] p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full justify-center text-slate-600 hover:text-slate-300 hover:bg-slate-800/50"
        >
          {collapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </div>
    </aside>
  )
}
